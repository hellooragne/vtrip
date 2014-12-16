import httplib
import requests

httpClient = None

class HttpClient(object):

    def __init__(self):
        pass

    def HttpSend(self, ip, port, method,
              data, TimeOut, body='', headers={}, controler='display'):
        try:
            if TimeOut == 0:
                httpClient = httplib.HTTPConnection(ip, port, timeout=0.5)
                httpClient.request(method, data, body, headers)
                response = httpClient.getresponse()
                ret_data = response.read()
                httpClient.close()
                return ret_data
            else:
                httpClient = httplib.HTTPConnection(ip, port, TimeOut)
                httpClient.request(method, data, body, headers)
                response = httpClient.getresponse()
                print response.status, response.reason
                ret_data = response.read()
                httpClient.close()
                return ret_data

        except Exception, e:
            if httpClient:
                httpClient.close()
            print "exception"
            print e

    def HttpGet(self, url, TimeOut, body='', headers={}):
        try:
            r = requests.get(url, headers=headers, timeout=TimeOut)
            return r.text
        except Exception, e:
            print "exception"
            print e

    def HttpPost(self, url, TimeOut, body='', headers={}):
        try:
            r = requests.post(url, body, headers=headers, timeout=TimeOut)
            return r.text
        except Exception, e:
            print "exception"
            print e

if __name__ == "__main__":
    httpobj = HttpClient()
    data = httpobj.HttpSend('image.baidu.com', 80, 'GET', '/channel?c=%E7%BE%8E%E5%A5%B3#%E7%BE%8E%E5%A5%B3', 10)
    print data
