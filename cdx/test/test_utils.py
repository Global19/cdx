import unittest
import gevent
import cdx.redisutils as redisutils
from cdx.blueprint import cdx_blueprint
import flask
import cdxlib.bbmodel as bbmodel
import cdx.start as start
import redis
import time
from gevent_zeromq import zmq
import redis
from requests.exceptions import ConnectionError
import requests

app = flask.Flask('test')
app.register_blueprint(cdx_blueprint)

def wait_flask():
    def helper():
        try:
            return requests.get('http://localhost:5006/cdx/userinfo/')
        except ConnectionError as e:
            return False
    return wait_until(helper)

def wait_redis_gone(port):
    def helper():
        client = redis.Redis(port=port)
        try:
            client.ping()
            return False
        except redis.ConnectionError:
            return True
    return wait_until(helper)

def wait_redis_start(port):
    def helper():
        client = redis.Redis(port=port)
        try:
            return client.ping()
        except redis.ConnectionError:
            pass
    return wait_until(helper)

def wait_until(func, timeout=1.0, interval=0.01):
    st = time.time()
    while True:
        if func():
            return True
        if (time.time() - st) > timeout:
            return False
        time.sleep(interval)

def recv_timeout(socket, timeout):
	poll = zmq.Poller()
	poll.register(socket, zmq.POLLIN)
	socks = dict(poll.poll(timeout=timeout))
	if socks.get(socket, None) == zmq.POLLIN:
		return socket.recv_multipart()
	else:
		return None
	
class CDXServerTestCase(unittest.TestCase):
    def setUp(self):

        start.prepare_app(app, rport=6899)
        start.prepare_local(app)
        self.servert = gevent.spawn(start.start_app, app)        
        self.redisproc = redisutils.RedisProcess(6899, '/tmp', save=False)
        wait_redis_start(6899)
        redis.Redis(port=6899).flushall()
        start.make_default_user(app)
        wait_flask()
        
    def tearDown(self):
        self.servert.kill()
        self.redisproc.close()
        wait_redis_gone(6899)
    
