import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { KISAccount, KISAccountCreate } from "@/api/kis";

interface KISAccountFormProps
  extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  onSubmit: (accountData: KISAccountCreate) => Promise<void>;
  onCancel?: () => void;
  initialData?: KISAccount;
  error?: string;
}

export function KISAccountForm({
  className,
  onSubmit,
  onCancel,
  initialData,
  error,
  ...props
}: KISAccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(error);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(undefined);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const accountData: KISAccountCreate = {
      account_number: formData.get("account_number") as string,
      account_id: formData.get("account_id") as string,
      app_key: formData.get("app_key") as string,
      sec_key: formData.get("sec_key") as string,
    };

    try {
      await onSubmit(accountData);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "계좌 저장에 실패했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        {formError && (
          <FieldError className="text-center">{formError}</FieldError>
        )}

        <Field>
          <FieldLabel htmlFor="account_number">계좌번호</FieldLabel>
          <Input
            id="account_number"
            name="account_number"
            type="text"
            placeholder="8자리 계좌번호를 입력하세요"
            defaultValue={initialData?.account_number}
            required
            disabled={isLoading}
            maxLength={20}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="account_id">실계좌 ID</FieldLabel>
          <Input
            id="account_id"
            name="account_id"
            type="text"
            placeholder="실계좌 ID를 입력하세요"
            defaultValue={initialData?.account_id}
            required
            disabled={isLoading}
            maxLength={50}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="app_key">App Key</FieldLabel>
          <Input
            id="app_key"
            name="app_key"
            type="text"
            placeholder="한국투자증권 App Key를 입력하세요"
            defaultValue={initialData?.app_key}
            required
            disabled={isLoading}
            maxLength={36}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="sec_key">App Secret</FieldLabel>
          <Input
            id="sec_key"
            name="sec_key"
            type="password"
            placeholder="한국투자증권 App Secret을 입력하세요"
            defaultValue={initialData?.sec_key}
            required
            disabled={isLoading}
            maxLength={180}
          />
        </Field>

        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
          )}
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading
              ? "저장 중..."
              : initialData
                ? "수정"
                : "계좌 등록"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
