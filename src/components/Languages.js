import React from 'react';
import Chip from '@material-ui/core/Chip';

const normalStyle = {
    color: '#ffffff', backgroundColor: '#282c34', margin: '2px', fontSize: "15px", fontWeight: "bold"
}
const selectedStyle = {
    color: '#000000', backgroundColor: '#ffffff', margin: '2px', fontSize: "15px", fontWeight: "bold"
}
const Languages = (props) => {
    return (
        <div>
            {props.data.map(e => {
                return <Chip key={e.alpha2} style={props.selected !== e.alpha2 ? normalStyle : selectedStyle} clickable onClick={(d) => props.handleAdd(e)} label={e.English} variant="outlined" />
            })}
        </div>
    )
}

export default Languages
