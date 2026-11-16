import { copyText } from '@/shared/lib'
import { useToast } from '@/shared/ui'

export function CopyButton({ text, label = '복사' }: { text: string; label?: string }) {
  const toast = useToast()
  return (
    <button
      type="button"
      className="ui-button ui-button--small ui-button--ghost"
      onClick={async () => toast((await copyText(text)) ? '계좌번호가 복사되었어요' : '복사에 실패했어요')}
    >
      {label}
    </button>
  )
}
