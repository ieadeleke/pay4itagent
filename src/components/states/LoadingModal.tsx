import Modal from '@mui/material/Modal';
import LinearProgress from '@mui/material/LinearProgress';

type LoadingModalProps = {
    isVisible?: boolean
}

export function LoadingModal(props: LoadingModalProps) {
    return <Modal
        open={props.isVisible || false}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <LinearProgress color="primary" sx={{ width: '100%', display: true ? 'inherit' : 'none', zIndex: 2000, position: 'fixed !important' }} />
    </Modal>
}