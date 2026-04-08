import { useConfirmModal } from '@/shared/model';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

export function ConfirmModalProvider() {
  const { isOpen, config, isLoading, closeConfirm, setLoading } = useConfirmModal();

  if (!config) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await config.onConfirm();
      closeConfirm();
    } catch (error) {
      console.error('Action failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={(open) => !open && closeConfirm()}
      onConfirm={handleConfirm}
      isLoading={isLoading}
      title={config.title}
      description={config.description}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      isDestructive={config.isDestructive}
    />
  );
}
