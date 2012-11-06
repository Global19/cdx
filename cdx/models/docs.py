import uuid
import cdx.models as models
import cdx.bbmodel as bbmodel
import logging
log = logging.getLogger(__name__)

def prune_and_get_valid_models(flaskapp, docid):
    doc = Doc.load(flaskapp.model_redis, docid)
    plot_context = flaskapp.collections.get(doc.plot_context_ref['type'],
                                            doc.plot_context_ref['id'])
    toplevelmodels = [plot_context]
    marked = set()
    temp = flaskapp.collections.get_bulk(docid)
    print "num models", len(temp)
    all_models = {}
    all_models_json = {}
    for x in temp:
        all_models_json[x.id] = x.attributes
        all_models[x.id] = x
        
    mark_recursive_models(all_models_json, marked, plot_context.attributes)

    for v in all_models_json.values():
        if v['id'] not in marked:
            typename = all_models[v['id']].typename
            flaskapp.collections.delete(typename, v['id'])
    valid_models = [x for x in all_models.values() if x.id in marked]
    return valid_models

def mark_recursive_models(all_models, marked, model):
    marked.add(model['id'])
    refs = []
    find_refs_json(model, refs=refs)
    for ref in refs:
        if ref['id'] in marked:
            continue
        model = all_models[ref['id']]
        mark_recursive_models(all_models, marked, model)
            
def is_ref(data):
    return (isinstance(data, dict) and
            'type' in data and
            'id' in data)

def find_refs_json(datajson, refs=None):
    refs = [] if refs is None else refs
    if is_ref(datajson):
        refs.append(datajson)
    elif isinstance(datajson, dict):
        find_refs_dict(datajson, refs=refs)
    elif isinstance(datajson, list):
        find_refs_list(datajson, refs=refs)
    else:
        pass
    
def find_refs_dict(datadict, refs=None):
    refs = [] if refs is None else refs        
    for k,v in datadict.iteritems():
        find_refs_json(v, refs=refs)
        
def find_refs_list(datalist, refs=None):
    refs = [] if refs is None else refs    
    for v in datalist:
        find_refs_json(v, refs=refs)
            
                
def new_doc(flaskapp, docid, title, rw_users=None, r_users=None):
    plot_context = bbmodel.ContinuumModel(
        'CDXPlotContext', docs=[docid])
    flaskapp.collections.add(plot_context)
    if rw_users is None: rw_users = []
    if r_users is None: r_users = []
    doc = Doc(docid, title, rw_users, r_users, plot_context.ref(), str(uuid.uuid4()))
    doc.save(flaskapp.model_redis)
    return doc

class Doc(models.ServerModel):
    typename = 'doc'
    idfield = 'docid'
    
    def __init__(self, docid, title, rw_users, r_users, plot_context_ref, apikey):
        self.docid = docid
        self.title = title
        self.rw_users = rw_users
        self.r_users = r_users
        self.plot_context_ref = plot_context_ref
        self.apikey = apikey
        
    def to_json(self):
        return {'docid' : self.docid,
                'title' : self.title,
                'rw_users' : self.rw_users,
                'r_users' : self.r_users,
                'plot_context_ref' : self.plot_context_ref,
                'apikey' : self.apikey,                
                }
    
    @staticmethod
    def from_json(obj):
        return Doc(obj['docid'], obj['title'],
                   obj['rw_users'], obj['r_users'],
                   obj['plot_context_ref'],
                   obj['apikey'])
    

