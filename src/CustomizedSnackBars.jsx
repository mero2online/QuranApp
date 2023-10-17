import { forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackBarsOptions } from './features/app/appSlice';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const CustomizedSnackBars = () => {
  const dispatch = useDispatch();
  const snackBarsOptions = useSelector((state) => state.app.snackBarsOptions);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(
      setSnackBarsOptions({
        ...snackBarsOptions,
        open: false,
      })
    );
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={snackBarsOptions.open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackBarsOptions.severity}
          sx={{ width: '100%' }}
        >
          {snackBarsOptions.msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
export default CustomizedSnackBars;
