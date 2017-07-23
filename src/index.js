import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import update from 'immutability-helper';
const heading = [{
        name:`Service type
        Room`,
        colSpan:1
    },
    {
        name:"Standard service",
        colSpan:2
    },
    {
        name:"Deluxe service",
        colSpan:2
    },
    {
        name:"Total",
        colSpan:1
    },
];
const charges = [
    ["Standard", 10, 15],
    ["Luxury", 20, 25],
    ["Supreme", 30, 35],
    ["Supreme Delux", 40, 45],
];

class TableHead extends React.Component{
    constructor(props) {
        super(props);
        this.renderCol = this.renderCol.bind(this);
    }

    renderCol(obj){
        return (<th colSpan={`1`} rowSpan={`2`} key={obj.name}>
                    {`${obj.name}`}
                </th>);
    }

    render(){
        const data = this.props.headings;
        return  (<thead>
                    <tr>
                        {data.map(this.renderCol)}
                    </tr>
                </thead>);
    }
}

class TableBody extends React.Component{
    constructor(props) {
        super(props);
        const {totalCols, charges} = this.props;
        this.charges = charges;
        const dataValues = new Array(totalCols).fill(0);
        this.state = {data:dataValues};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const {data} = this.state;
        let {value: newInputValue, id} = event.target;
        id = parseInt(id, 10);
        console.log(data, id);
        const oldSum = data[id - 1];
        const temp = data[2];
        const chargePerRoom = parseInt(this.charges[id], 10);
        let newTotal = 0;
        if (!(newInputValue==="" || (parseInt(newInputValue, 10) < 0)) ) {
            newTotal = chargePerRoom * parseInt(newInputValue, 10);
            const newData = update(data, {
                [id - 1]: {
                    $set: newTotal
                },
                2 : {
                    $set: temp - oldSum + newTotal
                }
            })
            this.setState({data:newData});
            this.props.handleChange(newTotal - oldSum);
        }
    }

    generateColumn = (value,index) => {
        let element = null;
        if(index !== 0){
            element = (
                <td key={`row${index}`}>
                    <input type={`number`} min={`0`} onChange={this.handleChange} id={index} />
                    { `(${value}*)` }
                </td>
            )
        }
        return element;
    }

    render() {
        const rowData = this.state.data;
        const element = this.charges.map(this.generateColumn)
        return (
            <tr>
                <td>
                    {this.charges[0]}
                </td>
                {element}
                <td>{rowData[2]}</td>
            </tr>
        )
    }
}

function TableFoot(props) {
    return (
        <tfoot>
            <tr>
                <td colSpan={`3`}> Grand Sum </td>
                <td>{props.grandTotal} </td>
            </tr>
        </tfoot>
    );
}

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.totalRows = parseInt(charges.length, 10);
        this.totalCols = parseInt(heading.length, 10) - 1;
        this.state = {
            grandTotal: 0,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(differenceValue) {
        const currentGrand = this.state.grandTotal;
        this.setState({grandTotal: currentGrand + differenceValue});
    }

    generateElement = () => {
        const bodyData = []
        for (let i = 0; i< this.totalRows; i++) {
            bodyData.push(this.generateRow(i));
        }
        return bodyData;
    }

    generateRow = (index)=> {
        return <TableBody totalCols={this.totalCols} charges={charges[index]} key={`row${index}`} rowNum={index} handleChange={this.handleChange} />
    }

    render() {
        return (
            <table>
                 <TableHead headings={heading} />
                 <tbody>
                     {this.generateElement()}
                 </tbody>
                 <TableFoot grandTotal={this.state.grandTotal} /> 
            </table>
        )
    }
}

function App(props) {
    return (<div id={`table-container`} >
                <Table />
                <span className={`label`} >* Cost Per Room</span>
           </div>);
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
