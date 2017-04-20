
window.Row = React.createClass({
    getInitialState: function() {
        return {};
    },
    handleClick: function() {
        window.tools.getMessage("me", this.props.data.id, function(results){
            $("#email_body").html(window.tools.getBody(results.payload));
            $("#email_header").html(window.tools.getHeader(results.payload.headers, 'Subject'));
            $("#readEmailModal").modal("show");

        });


    },
    render: function() {
        return (<tr onClick={this.handleClick} id={this.props.data.id} ><td name="Name">1</td><td name="Subject">2</td><td name="Body">...</td><td name="Date">4</td></tr>);
    }
});

window.DataTable = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {

        const  rows = this.props.data;

        const items = rows.map((element) =>
            <Row data={element} />
        );
        return (
            <table className='table table-bordered table-hover'>
                <thead>
                    <tr>
                        <th >Name</th>
                         <th>Object</th>
                         <th>Body</th>
                         <th>Date</th>
                    </tr>
                </thead>
                <tbody>{items}</tbody>
            </table>
        );
    }
});




