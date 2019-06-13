import React from 'react';
import './App.css';

import {Dropdown, DropdownButton, Table, Form, Row, Col, Button} from 'react-bootstrap';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

import facility from "./facility";

class DataTable extends React.Component {
    render() {
        if (this.props.facilitySelected >= 0) {
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
                {keys.map((o, i) => {
                    if (o !== "facility") {
                        return (
                            <tr key={i}>
                                <td>{o}</td>
                                <td>{object[o]}</td>
                            </tr>)
                    } else {
                        return null;
                    }
                })}
                </tbody>
            </Table>;
        } else {
            return null;
        }
    }
}


class DropdownList extends React.Component {
    render() {
        return (
            <Dropdown>
                <DropdownButton
                    id="dropdown-button"
                    title="Facilities"
                    variant="info"
                >
                    {
                        this.props.data.map((o, i) =>
                            <Dropdown.Item
                                as="button"
                                key={o.facility}
                                onSelect={() => this.props.onSelect(i)}
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
    render() {
        return (
            <div className="phase1">
                <h1>Phase 1</h1>
                <div className="dropdown">
                    <DropdownList
                        data={this.props.data}
                        onSelect={this.props.onSelect}
                    />
                </div>

                <div className="datatable">
                    <DataTable
                        data={this.props.data}
                        facilitySelected={this.props.facilitySelected}
                    />
                </div>

            </div>
        );
    }
}

class InputTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInput: {
                form_square_footage: 0,
                form_gas_heating: 0,
                form_cooling: 0,
                form_fans: 0,
                form_pumps: 0,
                form_lighting: 0,
                form_dhw: 0,
                form_process: 0
            },
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        let val = target.value ? target.value : 0;

        this.setState(state => {
            state.userInput[target.id] = val;
            state.total += parseFloat(val);
        })
    }

    handleClick() {
        const userInput = this.state.userInput;
        if (this.state.userInput.form_square_footage === 0) {
            alert("Square footage is invalid.");
        }
        this.props.callbackFromParent(userInput);
    }

    render() {
        const keys = this.props.keys;

        return (
            <Form>
                <Form.Group as={Row} controlId="form_square_footage">
                    <Form.Label column sm="6">
                        Square Footage
                    </Form.Label>
                    <Col sm="6">
                        <Form.Control type="number" onChange={this.handleChange}/>
                    </Col>
                </Form.Group>
                {keys.map((o, i) => {
                    const controlId = "form_" + o.replace(" ", "_").toLowerCase();
                    if (o !== "facility" && o !== "total") {
                        return (
                            <Form.Group as={Row} controlId={controlId} key={i}>
                                <Form.Label column sm="6">
                                    {o}
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="number" onChange={this.handleChange}/>
                                </Col>
                            </Form.Group>);
                    } else {
                        return null;
                    }
                })}

                <Button variant="primary" onClick={this.handleClick} block>
                    Submit
                </Button>
            </Form>
        );
    }
}

class OutputTable extends React.Component {
    render() {

        const object = this.props.object;
        const keys = this.props.keys;
        const userInput = this.props.userInput;
        const squareFootage = userInput["form_square_footage"];

        // convert string input to float
        Object.keys(userInput).map(key => {
            return userInput[key] = parseFloat(userInput[key])
        });

        const total = Object.values(userInput).reduce((a, b) => a + b);

        let plotDataProposed = {};
        Object.keys(userInput).map(key => {
            let fixedKey = key.replace("form_", "").replace("_", " ");
            if (fixedKey === "square footage") {
                return plotDataProposed["name"] = "Proposed"
            } else {
                if (fixedKey === "dhw") {
                    fixedKey = fixedKey.toUpperCase();
                }
                return plotDataProposed[fixedKey] = userInput[key] / squareFootage
            }
        });

        let plotDataBenchmark = {};
        Object.keys(object).map(key=>{
            if (key === "facility") {
                return plotDataBenchmark["name"] = "Benchmark"
            }
            else {
                return plotDataBenchmark[key] = object[key]
            }
        });

        const plotData = [plotDataProposed, plotDataBenchmark];


        /*Show table only if squareFootage is positive, else alert */
        if (this.props.facilitySelected === -1) {
            return null;
        }

        return (
            <div>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Proposed</th>
                        <th>Benchmark</th>
                    </tr>
                    </thead>
                    <tbody>
                    {keys.map((o, i) => {
                        if (o !== "facility" && o !== "total") {
                            let formTag = "form_" + o.replace(" ", "_").toLowerCase();
                            return (
                                <tr key={i}>
                                    <td>{o}</td>
                                    <td>{userInput[formTag] / squareFootage}</td>
                                    <td>{object[o]}</td>
                                </tr>)
                        } else {
                            return (
                                <tr key={i}>
                                    <td>{o}</td>
                                    <td>{total / squareFootage}</td>
                                    <td>{object["total"]}</td>
                                </tr>)
                        }
                    })}
                    </tbody>
                </Table>

                <BarChart
                    width={500}
                    height={300}
                    data={plotData}
                    margin={{
                        top: 20, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="gas heating" stackId="a" fill="#8884d8"/>
                    <Bar dataKey="cooling" stackId="a" fill="#82ca9d"/>
                    <Bar dataKey="fans" stackId="a" fill="#0088FE"/>
                    <Bar dataKey="pumps" stackId="a" fill="#00C49F"/>
                    <Bar dataKey="lighting" stackId="a" fill="#FFBB28"/>
                    <Bar dataKey="DHW" stackId="a" fill="#FF8042"/>
                    <Bar dataKey="process" stackId="a" fill="#B22222"/>
                </BarChart>
            </div>
        );


    }

}

class Phase2 extends React.Component {
    constructor(props) {
        super(props);
        this.getInputCallback = this.getInputCallback.bind(this);
        this.state = {
            formFilled: false,
            userInput: {
                form_square_footage: 0,
                form_gas_heating: 0,
                form_cooling: 0,
                form_fans: 0,
                form_pumps: 0,
                form_lighting: 0,
                form_dhw: 0,
                form_process: 0
            },
        };
    }

    getInputCallback(inputDataFromChild) {
        this.setState({
            userInput: inputDataFromChild,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("current state", this.state.userInput);
    }

    render() {
        const object = this.props.object;
        if (!object) {
            return null;
        }
        const keys = Object.keys(object);

        if (this.state.userInput.form_square_footage === 0) {
            return (
                <div className="phase2">
                    <h1>Phase 2</h1>
                    <div className="input-table">
                        <h5>Please enter data for your project.</h5>
                        <InputTable
                            keys={keys}
                            callbackFromParent={this.getInputCallback}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="phase2">
                    <h1>Phase 2</h1>
                    <div className="input-table">
                        <h5>Please enter data for your project.</h5>
                        <InputTable
                            keys={keys}
                            callbackFromParent={this.getInputCallback}
                        />
                    </div>
                    <div className="output-table">
                        <OutputTable
                            object={object}
                            keys={keys}
                            userInput={this.state.userInput}
                            facilitySelected={this.props.facilitySelected}
                        />
                    </div>
                </div>
            );
        }


    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            facilitySelected: -1,
            userInput: {},
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
        if (this.state.facilitySelected === -1) {
            return (
                <div className={"app"}>
                    <Phase1
                        data={this.state.data}
                        facilitySelected={this.state.facilitySelected}
                        onSelect={(i) => this.handleSelect(i)}
                    />
                </div>
            );
        } else {
            return (
                <div className={"app"}>
                    <Phase1
                        data={this.state.data}
                        facilitySelected={this.state.facilitySelected}
                        onSelect={(i) => this.handleSelect(i)}
                    />
                    <Phase2
                        facilitySelected={this.state.facilitySelected}
                        object={this.state.data[this.state.facilitySelected]}
                    />
                </div>
            );
        }
    }
}

export default App;
