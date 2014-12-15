
from urllib import urlencode
from HttpClient import HttpClient

class HuanChat(object):

    def __init__(self):
        self.httpobj = HttpClient()
        pass

    def GroupAdd(self, group_name):
        body = '{"groupname":"%s","desc":"server create group","public":true,"approval":true,"owner":"helloorange","maxusers":300}'\
                % (group_name)
        header = {"Authorization": "Bearer YWMtXGXVLIQxEeSGxB9SC9-JFQAAAUuB-hqPfkJ6BcaM87M5jAEa4SCrWHXKPKk"}
        url = 'https://a1.easemob.com/helloorange/vtrip/chatgroups'
        data = self.httpobj.HttpPost(url, 30, body, header)
        print body
        print data


if __name__ == "__main__":
    HuanChatObj = HuanChat()
    HuanChatObj.GroupAdd('mmmmmmmm')
