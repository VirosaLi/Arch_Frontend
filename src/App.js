import React from 'react';
import './App.css';

import { Dropdown, DropdownButton, Table } from 'react-bootstrap';

import facility from "./facility";

class DataTable extends React.Component{
    render() {
        if(this.props.facilitySelected >= 0) {
            const object = this.props.data[this.props.facilitySelected];
            const keys = Object.keys(object);
            return <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>#</th>
                    <th>{object["facility"]}</th>
                </tr>
                </thead>
                <tbody>
                {keys.map(o => {
                    if (o !== "facility") {
                        return (<tr>
                            <td>{o}</td>
                            <td>{object[o]}</td>
                        </tr>)
                    }
                    else {
                        return null;
                    }
                })}
                </tbody>
            </Table>;
        } else {
            return(
                <div></div>
            );
        }
    }
}


class DropdownList extends React.Component{
    render() {
        return (
            <Dropdown>
                <DropdownButton
                    id="dropdown-button"
                    title="Facilities"
                    variant="info"
                >
                    {
                        this.props.data.map((o, index) =>
                            <Dropdown.Item
                                as="button"
                                key={o.facility}
                                onSelect={() => this.props.onSelect(index)}
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

class Phase1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            facilitySelected: -1,
        };
    }

    componentDidMount() {
        facility.then(body => {
            this.setState(body);
        });
    }

    handleSelect(i) {
        this.setState({
            facilitySelected: i,
        })
    }

    render() {
        return (
            <div className="phase1">
                <div className="dropdown">
                    <DropdownList
                        data={this.state.data}
                        onSelect={(i) => this.handleSelect(i)}
                    />
                </div>

                <div className="datatable">
                    <DataTable
                        data={this.state.data}
                        facilitySelected={this.state.facilitySelected}
                    />
                </div>

            </div>
        );

    }
}


class App extends React.Component{
    render() {
        return (
            <div className={"app"}>
                <Phase1 />
            </div>
        );

    }
}

export default App;
