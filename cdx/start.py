from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer
from flask import request
import gevent
import gevent.monkey
gevent.monkey.patch_all()
import uuid
import socket
import redis
from cdx.app import app
import cdx.wsmanager as wsmanager
from cdxlib import protocol
import cdx.bbmodel as bbmodel
import cdx.models.user as user
import cdx.models.docs as docs
#import cdx.ipython.runnotebook as runnotebook
import logging
import time
port = 5006
log = logging.getLogger(__name__)

pubsub = "inproc://apppub"
pushpull = "inproc://apppull"

def prepare_app(rhost='127.0.0.1', rport=6379):
    #must import views before running apps
    import cdx.views.deps
    app.wsmanager = wsmanager.WebSocketManager()
    app.ph = protocol.ProtocolHelper()
    app.collections = bbmodel.ContinuumModelsStorage(
        redis.Redis(host=rhost, port=rport, db=2)
        )
    #for non-backbone models
    app.model_redis = redis.Redis(host=rhost, port=rport, db=3)
    app.secret_key = str(uuid.uuid4())

def make_default_user(app):
    docid = "defaultdoc"
    doc = docs.new_doc(app, docid, 'main', ["defaultuser"], apikey='nokey')
    cdxuser = user.new_user(app.model_redis, "defaultuser",
                            str(uuid.uuid4()),
                            docs=[doc.docid])
    return cdxuser
    
def prepare_local():
    app.debug = True
    #monkeypatching
    def current_user(request):
        cdxuser = user.User.load(app.model_redis, "defaultuser")
        if cdxuser is None:
            cdxuser = make_default_user(app)
        return cdxuser
    def write_plot_file(username, codedata):
        fpath = 'webplot.py'
        with open(fpath, "w+") as f:
            f.write(codedata)
    app.current_user = current_user
    app.write_plot_file = write_plot_file

http_server = None

def start_app():
    global http_server
    http_server = WSGIServer(('', 5006), app,
                             handler_class=WebSocketHandler,
                             )
    http_server.serve_forever()

    

#database

#logging