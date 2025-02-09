
import React from 'react';
import { useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import Box from '@material-ui/core/Box';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Timestamp from 'react-timestamp';
import {useDip20, getTokenMetadata} from '../hooks/useDip20';
import SendFormDAB from '../components/SendFormDAB';



export default function FungibleTokenList(props)
{
    const {dabTokens, tokenAmounts, tokenMetadata, tokenFees} = useDip20(props.childRefresh);
    const [checked, setChecked] = React.useState(() => {
      const saved = localStorage.getItem("hide0balancetokens");
      if (saved===null) return true;
      if (saved==="true") return true;
      return false;
    });

    let fees = tokenFees
    
    let decimals = tokenMetadata.map(metadata => {
      if (metadata!=null) {
        if (metadata.fungible.decimals==null) return 0
        return metadata.fungible.decimals;
      }
      return metadata;
    })


    const error = (e) => {
      props.alert("There was an error", e);
    };


    const styles = {
        empty : {
          maxWidth:300,
          margin : "0 auto",
        },
        table: {
          minWidth: 450,
        },
        button: {
            height: "100%",
            backgroundColor: '#003240',
            color: 'white'
          },
      };

      
  const handleChange = (event) => {
    setChecked(event.target.checked);
    localStorage.setItem("hide0balancetokens", event.target.checked);
  };
      

    return (
        <>

        <TableContainer component={Paper}>
            <Table style={styles.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                    dabTokens && fees && dabTokens.map((token, index) => 
                    {
                     
                      
                      let valueShown = 0;
                      let fee = 0;
                      let symbol = "";
                      if (tokenAmounts[index])
                      {
                        if (tokenAmounts[index].value>0){
                          valueShown = (tokenAmounts[index].value / Math.pow(10, tokenAmounts[index].decimals)).toFixed(6);
                        }
                      }
                      if (tokenMetadata[index])
                      {
                        symbol = tokenMetadata[index].fungible.symbol
                        fee = fees[index];
                        if (fee==undefined) fee = 0;
                        decimals = tokenMetadata[index].fungible.decimals
                      }

                      if (valueShown <= 0 && checked) return null
                        return (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Box
                                    component="img"
                                    sx={{
                                      height: 32,
                                      width: 32,
                                    }}
                                    alt=""
                                    src={token.icon}
                                  />
                                  </TableCell>
                                <TableCell>
                                    {token.name}
                                </TableCell>
                                <TableCell>
                                    {token.description}
                                </TableCell>
                                <TableCell>
                                    {valueShown + " " + symbol}
                                </TableCell>
                                {token && tokenAmounts && tokenAmounts[index] && valueShown > 0  ?
                                <TableCell>
                                <SendFormDAB styles={styles} setChildRefresh={props.setChildRefresh} childRefresh={props.childRefresh} alert={props.alert} error={error} loader={props.loader} token={token} value={ valueShown } minFee={fee} balance={valueShown} decimals={decimals}>
                                    <Button style={styles.button} color="inherit" variant="contained" endIcon={<SendIcon />}>
                                        Send
                                    </Button>
                                 </SendFormDAB>
                                </TableCell> : ""
                                 }

                            </TableRow>
                        )
                    }
                    )
                }
              </TableBody>
            </Table>
            <FormGroup>
               <Box sx={{ m: 1 }}>
               <FormControlLabel control={<Checkbox checked={checked} onChange={handleChange} size="small"/>}  label={<Typography variant="body2" color="textSecondary">Hide 0 Balance Tokens</Typography>} />
               </Box>
               
            </FormGroup>
          </TableContainer>
        </>
    );
}