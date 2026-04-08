import { useTranslation } from 'react-i18next';

import { Send } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

export function SendMessageInput() {
  const { t } = useTranslation('comment', { keyPrefix: 'send' });

  return (
    <div className="relative flex items-end gap-2">
      <Textarea
        placeholder={t('placeholder')}
        className="max-h-30 min-h-11 resize-none rounded-2xl pr-12"
        rows={1}
      />
      <Button size="icon" className="h-10 w-10 shrink-0 rounded-full">
        <Send className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
