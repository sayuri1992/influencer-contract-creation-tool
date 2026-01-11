export interface ContractData {
  createdDate: string
  recipientName: string
  purpose: string
  businessContent: string
  contractPeriod: string
  commissionFee: string
  bankName: string
  accountNumber: string
  accountHolder: string
  paymentMethod: string
  paymentCondition: string
  inspectionDeadline: string
  specialTerms: string
}

export const defaultContractData: ContractData = {
  createdDate: new Date().toISOString().split("T")[0],
  recipientName: "",
  purpose: "",
  businessContent: "",
  contractPeriod: "",
  commissionFee: "",
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  paymentMethod: "全額現金払\n(口座振込による。支払期日が金融機関の休業日にあたる場合は、翌営業日に支払う。）",
  paymentCondition: "・法人もしくは個人事業主でない場合、委託料より源泉所得税を引いた金額を振込ませていただきます。\n・適格請求書発行事業者登録番号（登録番号）がない場合、お支払い金額より1.82%を減額して振込ませていただきます。",
  inspectionDeadline: "甲が行なう検収の合格を以って、業務の完了とする",
  specialTerms: "・投稿案件のクライアントと直接のやりとりはしないこと。\n・投稿前に甲に投稿内容の確認を行わせること。\n・PR案件とわかるような投稿をすること。\n・投稿終了後にインサイトを提出すること。\n・クライアントの二次利用を許可すること。\n・甲からの連絡があり、返信が必要な場合は1日以内に返信すること。\n　※連絡がとれない場合は、報酬をお支払いできない場合があります。",
}
