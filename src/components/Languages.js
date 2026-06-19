import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0.5),
    minWidth: 120,
  },
  select: {
    borderRadius: '8px',
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    fontSize: '13px',
    fontWeight: '500',
    color: '#cbd5e1',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': {
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
    },
  },
}));

const Languages = ({ data, selected, handleAdd }) => {
    const classes = useStyles();

    const handleChange = (event) => {
        const selectedLang = data.find(e => e.alpha2 === event.target.value);
        if (selectedLang) {
            handleAdd(selectedLang);
        }
    };

    return (
        <FormControl variant="outlined" size="small" className={`${classes.formControl} filter_select_form`}>
            <Select
                value={selected}
                onChange={handleChange}
                className={classes.select}
                MenuProps={{
                    PaperProps: {
                        style: {
                            backgroundColor: '#1e293b',
                            color: '#cbd5e1',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                        },
                    },
                }}
            >
                {data.map((e) => (
                    <MenuItem 
                        key={e.alpha2} 
                        value={e.alpha2} 
                        style={{ fontSize: '13px', fontFamily: 'Montserrat, sans-serif' }}
                    >
                        {e.English}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default Languages;
