import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { KISAccountForm } from "@/components/kis-account-form";
import {
  getKISAccounts,
  createKISAccount,
  updateKISAccount,
  deleteKISAccount,
  type KISAccount,
  type KISAccountList,
  type KISAccountCreate,
} from "@/api/kis";

export function AccountSettings() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<KISAccountList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<KISAccount | undefined>(
    undefined
  );

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await getKISAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to load KIS accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAccount = async (accountData: KISAccountCreate) => {
    await createKISAccount(accountData);
    await loadAccounts();
    setShowForm(false);
  };

  const handleUpdateAccount = async (accountData: KISAccountCreate) => {
    if (editingAccount) {
      await updateKISAccount(editingAccount.id, accountData);
      await loadAccounts();
      setShowForm(false);
      setEditingAccount(undefined);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (confirm("정말 이 계좌를 삭제하시겠습니까?")) {
      await deleteKISAccount(id);
      await loadAccounts();
    }
  };

  const openCreateForm = () => {
    setEditingAccount(undefined);
    setShowForm(true);
  };

  const openEditForm = async (account: KISAccountList) => {
    // Fetch full account details including sensitive fields
    try {
      const response = await fetch(`/api/kis/accounts/${account.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const fullAccount = await response.json();
      setEditingAccount(fullAccount);
      setShowForm(true);
    } catch (error) {
      console.error("Failed to load account details:", error);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAccount(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Username</p>
            <p className="text-muted-foreground">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>한국투자증권 계좌</CardTitle>
              <CardDescription>KIS 계좌 정보를 관리합니다</CardDescription>
            </div>
            {!showForm && (
              <Button onClick={openCreateForm}>계좌 추가</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {editingAccount ? "계좌 수정" : "계좌 추가"}
              </h3>
              <KISAccountForm
                onSubmit={
                  editingAccount ? handleUpdateAccount : handleCreateAccount
                }
                onCancel={closeForm}
                initialData={editingAccount}
              />
            </div>
          ) : isLoading ? (
            <p className="text-muted-foreground text-center py-8">
              로딩 중...
            </p>
          ) : accounts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              등록된 계좌가 없습니다. 계좌를 추가해주세요.
            </p>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{account.account_number}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {account.account_id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      등록일:{" "}
                      {new Date(account.created_at).toLocaleDateString(
                        "ko-KR"
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(account)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
