"use client"

import type { ContractData } from "@/lib/contract-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, User, Briefcase, Calendar, Banknote, Building2, FileSignature } from "lucide-react"

interface ContractFormProps {
  data: ContractData
  onChange: (data: ContractData) => void
}

export function ContractForm({ data, onChange }: ContractFormProps) {
  const handleChange = (field: keyof ContractData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* 基本情報 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            基本情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="createdDate">作成日</Label>
              <Input
                id="createdDate"
                type="date"
                value={data.createdDate}
                onChange={(e) => handleChange("createdDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientName">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  氏名（受託者名）
                </span>
              </Label>
              <Input
                id="recipientName"
                placeholder="山田 太郎"
                value={data.recipientName}
                onChange={(e) => handleChange("recipientName", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 契約内容 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5 text-primary" />
            契約内容
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">目的</Label>
            <Textarea
              id="purpose"
              placeholder="業務委託の目的を入力してください"
              value={data.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessContent">業務の内容</Label>
            <Textarea
              id="businessContent"
              placeholder="業務の具体的な内容を入力してください"
              value={data.businessContent}
              onChange={(e) => handleChange("businessContent", e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contractPeriod">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  契約期間
                </span>
              </Label>
              <Input
                id="contractPeriod"
                placeholder="2024年1月1日〜2024年12月31日"
                value={data.contractPeriod}
                onChange={(e) => handleChange("contractPeriod", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionFee">
                <span className="flex items-center gap-1">
                  <Banknote className="h-4 w-4" />
                  委託料
                </span>
              </Label>
              <Input
                id="commissionFee"
                placeholder="100,000円（税込）"
                value={data.commissionFee}
                onChange={(e) => handleChange("commissionFee", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inspectionDeadline">検査完了期日</Label>
            <Input
              id="inspectionDeadline"
              placeholder="検査完了期日を入力してください"
              value={data.inspectionDeadline}
              onChange={(e) => handleChange("inspectionDeadline", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 支払い先情報 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            支払い先情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">金融機関名</Label>
            <Input
              id="bankName"
              placeholder="○○銀行 ○○支店"
              value={data.bankName}
              onChange={(e) => handleChange("bankName", e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">口座番号</Label>
              <Input
                id="accountNumber"
                placeholder="普通 1234567"
                value={data.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountHolder">口座名義</Label>
              <Input
                id="accountHolder"
                placeholder="ヤマダ タロウ"
                value={data.accountHolder}
                onChange={(e) => handleChange("accountHolder", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">支払方法</Label>
            <Textarea
              id="paymentMethod"
              placeholder="支払方法を入力してください"
              value={data.paymentMethod}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentCondition">支払条件</Label>
            <Textarea
              id="paymentCondition"
              placeholder="支払条件を入力してください"
              value={data.paymentCondition}
              onChange={(e) => handleChange("paymentCondition", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* 特約事項 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSignature className="h-5 w-5 text-primary" />
            特約事項
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="specialTerms">特約事項（任意）</Label>
            <Textarea
              id="specialTerms"
              placeholder="特約事項がある場合は入力してください"
              value={data.specialTerms}
              onChange={(e) => handleChange("specialTerms", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
