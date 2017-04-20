

window.tools = function(){
    return{

        getMessage: function(userId, messageId, callback) {
            var request = gapi.client.gmail.users.messages.get({
                'userId': userId,
                'id': messageId,
                "format": "full"
            });
            request.execute(callback);
        },

        getHeader:function(headers, index) {
            var header = '';

            $.each(headers, function(){
                if(this.name === index){
                    header = this.value;
                }
            });
            return header;
        },

        getBody:function(message) {
            var encodedBody = '';
            if(typeof message.parts === 'undefined')
            {
                encodedBody = message.body.data;
            }
            else
            {
                encodedBody = window.tools.getHTMLPart(message.parts);
            }
            encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
            return decodeURIComponent(escape(window.atob(encodedBody)));
        },

        getHTMLPart:function(arr) {
            for(var x = 0; x <= arr.length; x++)
            {
                if(typeof arr[x].parts === 'undefined')
                {
                    if(arr[x].mimeType === 'text/html')
                    {
                        return arr[x].body.data;
                    }
                }
                else
                {
                    return window.tools.getHTMLPart(arr[x].parts);
                }
            }
            return '';
        }


    }
}();