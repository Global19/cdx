import websocket
import requests
import urlparse
import utils
import uuid
import logging
log = logging.getLogger(__name__)

class ContinuumModel(object):
    collections = ['Continuum', 'Collections']    
    def __init__(self, typename, **kwargs):
        self.attributes = kwargs
        self.typename = typename
        self.attributes.setdefault('id', str(uuid.uuid4()))
        
    def ref(self):
        return {
            'collections' : self.collections,
            'type' : self.typename,
            'id' : self.attributes['id']
            }
    def get(self, key):
        return self.attributes.get(key)
    
    def set(self, key, val):
        self.attributes[key] = val
        
    def to_broadcast_json(self):
        #more verbose json, which includes collection/type info necessary
        #for recon on the JS side.
        json = self.ref()
        json['attributes'] = self.attributes
        return json
    
    def to_json(self):
        return self.attributes
"""
In our python interface to the backbone system, we separate the local collection
which stores models, from the http client which interacts with a remote store
In applications, we would use a class that combines both
"""

    
class ContinuumModelsStorage(object):
    def __init__(self):
        self.collections = {}

    def get_bulk(self, docid, typename=None, id=None):
        result = []
        for k,v in self.collections.iteritems():
            if docid in v.get('docs') and \
               (typename is None or k[0] == typename) and \
               (id is None or k[1] == id):
                result.append(v)
        return result
    
    def get(self, typename, id):
        return self.collections.get((typename, id))

    def add(self, model):
        self.collections[model.typename, model.attributes['id']] = model

    def update(self, typename, attributes):
        id = attributes['id']
        model = self.get(typename, id)
        for k,v in attributes.iteritems():
            model.set(k, v)
        return model
    
    def delete(self, typename, id):
        del self.collections[typename, id]
        
class ContinuumModelsClient(object):
    def __init__(self, docid, baseurl, ph):
        self.ph = ph
        self.baseurl = baseurl
        self.docid = docid
        self.s = requests.session()
        super(ContinuumModelsClient, self).__init__()
        
    def delete(self, typename, id):
        url = utils.urljoin(self.baseurl, self.docid +"/", typename + "/", id)
        self.s.delete(url)
        
    def create(self, typename, attributes):
        if 'docs' not in attributes:
            attributes['docs'] = [self.docid]
        model =  ContinuumModel(typename, **attributes)
        url = utils.urljoin(self.baseurl, self.docid +"/", typename)
        log.debug("create %s", url)
        self.s.post(url, data=self.ph.serialize_msg(model.to_json()))
        return model

    def update(self, typename, attributes):
        if 'docs' not in attributes:
            attributes['docs'] = [self.docid]
        id = attributes['id']
        model =  ContinuumModel(typename, **attributes)
        url = utils.urljoin(self.baseurl, self.docid +"/", typename + "/", id)
        log.debug("create %s", url)
        self.s.put(url, data=self.ph.serialize_web(model.to_json()))
        return model

    def fetch(self, typename=None, id=None):
        if typename is None:
            url = utils.urljoin(self.baseurl, self.docid)
            data = self.s.get(url).content
            specs = self.ph.deserialize_web(data)
            models =  [ContinuumModel(
                x['type'], **x['attributes']) for x in specs]
            return models
        elif typename is not None and id is None:
            url = utils.urljoin(self.baseurl, self.docid +"/", typename)
            attrs = self.ph.deserialize_web(self.s.get(url).content)
            models = [ContinuumModel(typename, **x) for x in attrs]
            return models
        elif typename is not None and id is not None:
            url = utils.urljoin(self.baseurl, self.docid +"/", typename + "/", id)
            attr = self.ph.deserialize_web(self.s.get(url).content)
            model = ContinuumModel(typename, attr)
            return model
        
class ContinuumModels(object):
    def __init__(self, storage, client):
        self.storage = storage
        self.client = client
        
    def create(self, typename, attributes):
        model = self.client.create(typename, attributes)        
        self.storage.add(model)        

    def update(self, typename, attributes):
        id = attributes['id']
        model = self.client.update(typename, attributes)
        self.storage.update(typename, model.attributes)
        return model
    
    def get(self, typename, id):
        return self.storage.get(typename, id)

    def fetch(self, typename=None, id=None):
        if typename is None or id is None:        
            models = self.client.fetch(typename=typename, id=id)
            for m in models:
                self.storage.add(m)
            return models
        else:
            model = self.client.fetch(typename=typename, id=id)
            self.storage.add(model)
            return model
        
    def delete(self, typename, id):
        self.storage.delete(typename, id)
        self.client.delete(typename, id)
        