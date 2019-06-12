import React from 'react';
import './App.css';

import { Dropdown, DropdownButton, Table } from 'react-bootstrap';

import facility from "./facility";

class DataTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        facility.then(body => {
            this.setState(body[this.props.index]);
            //console.log(this.state.data)
        });
    }

    render() {
        return (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td colSpan="2">Larry the Bird</td>
                    <td>@twitter</td>
                </tr>
                </tbody>
            </Table>
        );
    }
}


class DropdownList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        facility.then(body => {
            this.setState(body);
            //console.log(this.state.data)
        });
    }


    render() {

        return (
            <Dropdown>

                <DropdownButton
                    id="dropdown-button"
                    title="Facilities"
                    variant="info"
                >
                    {
                        this.state.data.map((o, index) =>
                            <Dropdown.Item
                                as="button"
                                key={o.facility}
                                eventKey={index}
                                onSelect={(eventKey) => {
                                    console.log(eventKey);
                                    console.log(o);
                                }}
                            >
                                {o.facility}
                            </Dropdown.Item>
                        )
                    }

                </DropdownButton>

            </Dropdown>
        );
    }
}


class App extends React.Component{

    render() {
        return (
            <DropdownList />
        );

    }
}

export default App;
