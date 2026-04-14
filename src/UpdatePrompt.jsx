import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

function UpdatePrompt() {
  const [registration, setRegistration] = useState(null);
  const [updating, setUpdating] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, r) {
      if (r) setRegistration(r);
    },
  });

  const onUpdate = async () => {
    setUpdating(true);
    try {
      // Tell the waiting SW to skip waiting; vite-plugin-pwa will reload
      // on controllerchange. We also set a safety-net reload in case
      // controllerchange never fires (e.g. no waiting worker present).
      await updateServiceWorker(true);
    } catch {
      /* ignore */
    }
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  useEffect(() => {
    if (!registration) return;

    const checkForUpdate = () => {
      if (navigator.onLine) {
        registration.update().catch(() => {
          /* offline or network error — ignore */
        });
      }
    };

    const interval = setInterval(checkForUpdate, 60 * 1000);
    window.addEventListener('online', checkForUpdate);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkForUpdate();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', checkForUpdate);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [registration]);

  return (
    <Dialog
      open={needRefresh}
      disableEscapeKeyDown
      aria-labelledby='update-dialog-title'
    >
      <DialogTitle id='update-dialog-title'>
        <SystemUpdateAltIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        New Version Available
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          A new version of the app is available. Please update to get the
          latest features and fixes.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onUpdate}
          variant='contained'
          color='primary'
          autoFocus
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Update Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdatePrompt;
