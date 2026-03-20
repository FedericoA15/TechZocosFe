import React, { useEffect, useState, useMemo, useCallback } from "react";
import { 
  Search, Filter, MoreHorizontal, 
  Trash2, UserCog, UserPlus, 
  SearchX, Loader2, ArrowUpDown,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { useLanguage } from "../../core/context";
import { userService } from "../../core/services/user.service";
import type { User } from "../../core/types/user";
import type { PaginatedResponse } from "../../core/types/api";
import { Modal, ConfirmModal } from "../../shared/components/ui";
import { UserForm } from "./components/UserForm";
import { toast } from "sonner";

export const AdminUsersPage: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof User>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<(Partial<User> & { password?: string }) | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(page, pageSize, includeInactive);
      setData(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, includeInactive]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtering & Sorting (In-memory for the current page)
  const filteredUsers = useMemo(() => {
    const items = data?.items || [];
    return items.filter((u: User) => 
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    ).sort((a: User, b: User) => {
      const aVal = (a[sortField] || "").toString().toLowerCase();
      const bVal = (b[sortField] || "").toString().toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, search, sortField, sortOrder]);

  const toggleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleConfirmDelete = (user: User) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    
    setDeleteLoading(true);
    try {
      await userService.deleteUser(userToDelete.id);
      toast.success(t("successDelete"));
      setIsConfirmOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Error deleting user");
    } finally {
      setDeleteLoading(false);
      setUserToDelete(null);
    }
  };

  const handleOpenModal = (user?: User) => {
    setSelectedUser(user || {
      firstName: "",
      lastName: "",
      email: "",
      role: "User",
      password: ""
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setFormLoading(true);
    try {
      if (selectedUser.id) {
        // Edit
        await userService.updateUser(selectedUser.id, selectedUser);
        toast.success(t("successUpdate"));
      } else {
        // Create
        await userService.createUser(selectedUser as Omit<User, "id"> & { password?: string });
        toast.success(t("successAdd"));
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Error saving user");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="text-zoco-lime animate-spin" size={40} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              {t("manageUsersTitle")}
            </h2>
            <p className="text-slate-500 dark:text-white/40 font-medium">
              {t("manageUsersSubtitle")}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIncludeInactive(!includeInactive)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${
                includeInactive 
                  ? "bg-red-500/10 border-red-500/20 text-red-500" 
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/60"
              }`}
            >
              <Filter size={18} />
              {t("includeInactive")}
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zoco-lime text-zoco-navy font-black text-sm hover:shadow-lg transition-all active:scale-95"
            >
              <UserPlus size={18} />
              {t("add")}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-zoco-lime transition-colors" size={18} />
            <input 
              type="text"
              placeholder={t("searchUsers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-medium"
            />
          </div>
        </div>

        {/* Users Table / List */}
        {!data || filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200/50 dark:border-white/5">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 mb-4">
              <SearchX size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
              {t("noUsersFound")}
            </h3>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-left bg-slate-50/50 dark:bg-white/5">
                    <th className="px-6 py-5 cursor-pointer" onClick={() => toggleSort("firstName")}>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 underline-offset-4 hover:underline">
                        {t("name")}
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-5 hidden md:table-cell">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                        {t("email")}
                      </span>
                    </th>
                    <th className="px-6 py-5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                        {t("role")}
                      </span>
                    </th>
                    <th className="px-6 py-5 text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                        {t("actions")}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredUsers.map((u: User) => (
                    <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-zoco-lime/10 flex items-center justify-center text-zoco-lime font-black text-sm shrink-0 uppercase">
                            {u.firstName?.[0] || ""}{u.lastName?.[0] || ""}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 dark:text-white group-hover:text-zoco-lime transition-colors">
                              {u.firstName} {u.lastName}
                            </span>
                            <span className="text-xs font-medium text-slate-400 dark:text-white/30 truncate md:hidden">
                              {u.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm font-medium text-slate-500 dark:text-white/50">
                          {u.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${u.role === "Admin"
                            ? "bg-zoco-lime/15 text-zoco-lime"
                            : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40"
                          }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {u.role === "Admin" ? t("roleAdmin") : t("roleUser")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(u)}
                            className="p-2.5 rounded-xl text-slate-400 hover:text-zoco-lime hover:bg-zoco-lime/10 transition-all active:scale-95" title={t("edit")}
                          >
                            <UserCog size={18} />
                          </button>
                          <button 
                            onClick={() => handleConfirmDelete(u)}
                            className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95" 
                            title={t("delete")}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <button className="md:hidden p-2 rounded-xl text-slate-400 group-hover:hidden transition-all">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
              <p className="text-xs font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">
                {t("page")} {data.pageNumber} / {data.totalPages} ({data.totalItems} total)
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!data.hasPreviousPage || loading}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 text-slate-600 dark:text-white/60 disabled:opacity-30 transition-all hover:bg-slate-50 dark:hover:bg-white/10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.hasNextPage || loading}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 text-slate-600 dark:text-white/60 disabled:opacity-30 transition-all hover:bg-slate-50 dark:hover:bg-white/10"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedUser?.id ? t("edit") : t("add")}
      >
        <UserForm 
          user={selectedUser || {}}
          onChange={setSelectedUser}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title={t("delete")}
        message={`${t("deleteConfirm")} ${userToDelete?.firstName}?`}
      />
    </>
  );
};
