
window.contacts = [];
window.labels = [];
window.pagesTokens = [];
var clientId = '652891809968-7lhc8luspfibgf369jbj8fp83r2j47te.apps.googleusercontent.com';
var apiKey = 'AIzaSyAT852FF2Z7mYiopyhbMxgEobAK6Dl7gEQ';
var scopes = 'https://www.googleapis.com/auth/gmail.send ' +
    'https://www.googleapis.com/auth/contacts.readonly ' +
    'https://www.googleapis.com/auth/gmail.compose ' +
    'https://mail.google.com/ ' +
    'https://www.googleapis.com/auth/gmail.modify ' +
    'https://www.googleapis.com/auth/gmail.readonly ';



function authorize() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthorization);
}
function handleAuthorization(authorizationResult) {
    if (authorizationResult && !authorizationResult.error) {

        loadGmailApi();

        window.authorizationResult = authorizationResult;

        $('#googleLoginModal').modal('hide');

        // get Labels
        axios.get("https://www.googleapis.com/gmail/v1/users/me/labels?alt=json&access_token=" + authorizationResult.access_token )
            .then(res => {
            window.labels = [];
            for(var item in res.data.labels){
                window.labels.push(res.data.labels[item].name);
            }
            ReactDOM.render(<Menu data={window.labels} />,
                document.getElementById('sidebar')
            );
        });


        // get contacts
        getContacts();

        //get Messages
        window.page = 0;
        getMessages(window.page);


    }
}

function loadGmailApi() {
    gapi.client.load('gmail', 'v1', function(){});
}

window.getContacts = function(){





    axios.get("https://www.google.com/m8/feeds/contacts/default/thin?alt=json&access_token=" + window.authorizationResult.access_token + "&max-results=500&v=3.0")
        .then(res => {
        window.contacts = [];
        console.log(res);
        for(var index in res.data.feed.entry){
            if(res.data.feed.entry[index].gd$email != undefined)



                for(var emailIndex in res.data.feed.entry[index].gd$email){

                    contacts.push({
                        id: emailIndex,
                        name: res.data.feed.entry[index].gd$email[emailIndex].address,
                        full_name: res.data.feed.entry[index].title.$t
                    });
                }
        }

        $('#input_to').typeahead({
            source: window.contacts
        });
    });

}


window.getMessages =function(pageIndex){

    console.log(pageIndex);
    if(pageIndex == 0){
        $("#nav_prev").addClass("disabled");
    }else {
        $("#nav_prev").removeClass("disabled");
    }

    var page = "";
    if(window.pagesTokens[pageIndex] != undefined || pageIndex > 0){
        page = "&pageToken="+ window.pagesTokens[pageIndex];
    }
    var label = "";
    if(window.selectedLabel != undefined && window.selectedLabel != "All"){
        label = "&labelIds="+ window.selectedLabel;
    }

    axios.get("https://www.googleapis.com/gmail/v1/users/me/messages?alt=json&access_token=" + window.authorizationResult.access_token + "&maxResults=10" + page + label)
        .then(res => {

            window.pagesTokens[pageIndex +1] = res.data.nextPageToken;
            for(var item in res.data.messages){
                getEmail(res.data.messages[item].id, authorizationResult);
            }

            ReactDOM.render(<DataTable data={res.data.messages} />,
                document.getElementById('messages')
            );
        });

}


window.getEmail = function(id, authorizationResult){
    //console.log("https://www.googleapis.com/gmail/v1/users/me/threads/"+id+"?alt=json&format=METADATA&access_token=" + authorizationResult.access_token);
    axios.get("https://www.googleapis.com/gmail/v1/users/me/threads/"+id+"?alt=json&format=METADATA&access_token=" + authorizationResult.access_token )
        .then(res => {

        var headres = res.data.messages[0].payload.headers;

        for(var item in headres){
            if(headres[item].name == "Subject"){
                $('#'+res.data.id).find("td[name=Subject]").html(headres[item].value);
            }
            if(headres[item].name == "From"){
                $('#'+res.data.id).find("td[name=Name]").html(headres[item].value);
            }
            if(headres[item].name == "Date"){
                $('#'+res.data.id).find("td[name=Date]").html(headres[item].value);
            }
            if(headres[item].name == "Message-ID"){
                $('#'+res.data.id).data('message_id', headres[item].value);
            }
        }


    });
}


window.GoogleLogin = React.createClass({
    getInitialState: function() {
        return {
            isSelected: false
        };
    },
    handleClick: function() {
        this.setState({
            isSelected: true
        });

        window.setTimeout(authorize);
    },
    render: function() {

        return (
            <button type="button" className="btn btn-danger" onClick={this.handleClick} ><i className="fa fa-google-plus"></i> {this.props.content}</button>
        );
    }
});



window.NavigationPrevious = React.createClass({
    getInitialState: function() {
        return {};
    },
    handleClick: function(type) {
        window.page = window.page-1;
        getMessages(window.page);
    },
    render: function() {

        return(
            <li className="page-item disabled" id="nav_prev">
            <a className="page-link" onClick={this.handleClick} href="javascript:void(0)" tabindex="-1">Previous</a>
            </li>
        );
    }
});


window.NavigationNext = React.createClass({
    getInitialState: function() {
        return {};
    },
    handleClick: function(type) {
        window.page = window.page+1;
        getMessages(window.page);
    },
    render: function() {
        return(
            <li className="page-item">
            <a className="page-link" onClick={this.handleClick} href="javascript:void(0)" >Next</a>
            </li>
        );
    }
});

