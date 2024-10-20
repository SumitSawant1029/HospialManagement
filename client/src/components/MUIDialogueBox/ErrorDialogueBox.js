import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Slide from '@mui/material/Slide';

// Transition element for the Dialogue Box
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ErrorDialogueBox(props) {
    let empRowList = props.ErrorList ? props.ErrorList.map((err, index) => (
        <p className="text-center" key={index}>{err}</p>
    )) : <p className="text-center">No errors to display</p>;

    return (
        <Dialog open={props.open} onClose={props.handleToClose} TransitionComponent={Transition} keepMounted PaperProps={{ sx: { minWidth: "20%" } }} >
            <DialogTitle>{props.ErrorTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {empRowList}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleToClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// Set default props to ensure ErrorList is never undefined
ErrorDialogueBox.defaultProps = {
    ErrorList: []
};

export default ErrorDialogueBox;
