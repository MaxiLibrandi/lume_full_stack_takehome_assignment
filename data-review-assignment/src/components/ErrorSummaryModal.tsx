import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ErrorSummaryModal({ showModal, handleClose, errorSummary }: { showModal: boolean; handleClose: any; errorSummary: any }) {
    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Error Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    errorSummary.map((error: any, index: number) => (
                        <div key={index}>
                            <h4>{error.severity.toUpperCase()} - {error.field.toUpperCase()}</h4>
                            <p>{error.message}</p>
                            <hr /> 
                        </div>
                    ))
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}