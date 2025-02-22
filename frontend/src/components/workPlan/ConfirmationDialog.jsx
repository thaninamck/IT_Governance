import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
  } from "@material-tailwind/react";
  import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
  
  export function ConfirmationDialog({ open, setOpen, onConfirm,appname }) {
    const handleClose = () => setOpen(false);
  
    return (
      <Dialog open={open} handler={handleClose} size="sm">
        <DialogHeader className="justify-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />
        </DialogHeader>
        <DialogBody className="text-center">
          <Typography variant="h5" color="blue-gray">
            Confirmation
          </Typography>
          <Typography className="text-gray-700 mt-2">
            Avez-vous terminé avec cette application {appname}?
          </Typography>
        </DialogBody>
        <DialogFooter className="flex justify-center space-x-4">
          <Button variant="outlined" color="blue-gray" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="gradient"
            color="amber"
            onClick={() => {
              onConfirm();
              handleClose();
            }}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }
  