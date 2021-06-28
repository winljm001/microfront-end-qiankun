export interface ModalRef {
  /** 打开弹框 */
  open?: (obj?: any) => void
  /** 关闭弹框 */
  close?: () => void
}
