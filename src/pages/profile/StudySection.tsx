import React, { useEffect, useState, useCallback } from "react";
import { 
  BookOpen, Plus, Trash2, Edit3, 
  SearchX, Loader2, GraduationCap,
  Calendar, Building2, FileText,
  ChevronLeft, ChevronRight, Filter, User as UserIcon
} from "lucide-react";
import { useAuth, useLanguage } from "../../core/context";
import { studyService } from "../../core/services/study.service";
import type { Study } from "../../core/types/user";
import type { PaginatedResponse } from "../../core/types/api";
import { Modal, ConfirmModal } from "../../shared/components/ui";
import { toast } from "sonner";
import { userService } from "../../core/services/user.service";
import type { User } from "../../core/types/user";

interface StudySectionProps {
  globalView?: boolean;
}

export const StudySection: React.FC<StudySectionProps> = ({ globalView = false }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [studies, setStudies] = useState<Study[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Study> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Partial<Study> | null>(null);
  const [studyToDelete, setStudyToDelete] = useState<Study | null>(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStudies = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      if (globalView) {
        const [studiesData, usersData] = await Promise.all([
          studyService.getAllStudies(page, pageSize, includeInactive),
          userService.getAllUsers(1, 1000, true) // Fetch many users for mapping
        ]);
        
        const nameMap: Record<string, string> = {};
        usersData.items.forEach((u: User) => {
          nameMap[u.id] = `${u.firstName} ${u.lastName}`;
        });
        
        setUserNames(nameMap);
        setPaginatedData(studiesData);
        setStudies(studiesData.items);
      } else {
        const data = await studyService.getStudiesByUserId(user.id);
        if (Array.isArray(data)) {
          setStudies(data);
          setPaginatedData(null);
        } else {
          const paginated = data as unknown as PaginatedResponse<Study>;
          setStudies(paginated.items || []);
          setPaginatedData(paginated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, globalView, page, pageSize, includeInactive]);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    // Extracts YYYY-MM-DD from ISO or other common formats
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString.split('T')[0] || ""; 
      return date.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  const handleOpenModal = (study?: Study) => {
    setSelectedStudy(study ? {
      ...study,
      startDate: formatDateForInput(study.startDate),
      endDate: formatDateForInput(study.endDate),
    } : {
      userId: user?.id,
      title: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudy || !user?.id) return;
    
    setFormLoading(true);
    try {
      if (selectedStudy.id) {
        await studyService.updateStudy(selectedStudy.userId || user.id, selectedStudy.id, selectedStudy);
        toast.success(t("successUpdate"));
      } else {
        await studyService.createStudy(selectedStudy as Omit<Study, "id">);
        toast.success(t("successAdd"));
      }
      setIsModalOpen(false);
      fetchStudies();
    } catch (err) {
      console.error(err);
      toast.error("Error saving study");
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = (study: Study) => {
    setStudyToDelete(study);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!studyToDelete) return;
    
    setDeleteLoading(true);
    try {
      await studyService.deleteStudy(studyToDelete.userId, studyToDelete.id);
      toast.success(t("successDelete"));
      setIsConfirmOpen(false);
      fetchStudies();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting study");
    } finally {
      setDeleteLoading(false);
      setStudyToDelete(null);
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zoco-lime/10 flex items-center justify-center text-zoco-lime">
            <GraduationCap size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
              {globalView ? t("manageStudiesTitle") : t("navStudies")}
            </h3>
            <p className="text-xs font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">
              {paginatedData ? paginatedData.totalItems : studies.length} {t("academicRecords")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {globalView && (
            <button 
              onClick={() => setIncludeInactive(!includeInactive)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all border uppercase tracking-widest ${
                includeInactive 
                  ? "bg-red-500/10 border-red-500/20 text-red-500" 
                  : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/60"
              }`}
            >
              <Filter size={16} />
              {t("includeInactive")}
            </button>
          )}
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zoco-lime text-zoco-navy font-black text-xs hover:shadow-lg transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={16} />
            {t("add")}
          </button>
        </div>
      </div>

      {loading && (studies.length === 0 && !paginatedData) ? (
        <div className="flex py-12 justify-center">
          <Loader2 className="animate-spin text-zoco-lime" size={24} />
        </div>
      ) : (studies.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-white/10 mb-4">
            <SearchX size={32} />
          </div>
          <p className="text-sm font-bold text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">
            {globalView ? t("noStudiesFound") : t("noStudiesYet")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studies.map((study) => (
              <div key={study.id} className="group relative bg-slate-50/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-3xl p-6 hover:border-zoco-lime hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zoco-navy flex items-center justify-center text-slate-400 dark:text-white/30 group-hover:text-zoco-lime transition-colors border border-slate-100 dark:border-white/5 shadow-sm">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => handleOpenModal(study)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-zoco-lime hover:bg-zoco-lime/10 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleConfirmDelete(study)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h4 className="font-black text-slate-800 dark:text-white mb-1 leading-tight uppercase text-sm tracking-tight">
                  {study.title}
                </h4>
                <p className="text-xs font-bold text-slate-500 dark:text-white/40 mb-3 uppercase tracking-wider">
                  {study.institution}
                </p>
                {globalView && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mb-2">
                    <UserIcon size={12} />
                    <span>{t("user")}: {userNames[study.userId] || study.userId.split("-")[0] + "..."}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
                  <Calendar size={12} />
                  <span>{study.startDate} — {study.endDate || "Present"}</span>
                </div>
              </div>
            ))}
          </div>

          {globalView && paginatedData && (
            <div className="flex items-center justify-between px-2 pt-8">
              <p className="text-xs font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">
                {t("page")} {paginatedData.pageNumber} / {paginatedData.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!paginatedData.hasPreviousPage || loading}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/60 disabled:opacity-30 transition-all hover:bg-zoco-lime/10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={!paginatedData.hasNextPage || loading}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/60 disabled:opacity-30 transition-all hover:bg-zoco-lime/10"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit/Create Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedStudy?.id ? t("edit") : t("add")}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
              {t("name")}
            </label>
            <div className="relative">
              < GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text"
                required
                value={selectedStudy?.title || ""}
                onChange={(e) => setSelectedStudy({ ...selectedStudy, title: e.target.value })}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
              {t("institution")}
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text"
                required
                value={selectedStudy?.institution || ""}
                onChange={(e) => setSelectedStudy({ ...selectedStudy, institution: e.target.value })}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
                {t("startDate")}
              </label>
              <input 
                type="date"
                required
                value={selectedStudy?.startDate || ""}
                onChange={(e) => setSelectedStudy({ ...selectedStudy, startDate: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
                {t("endDate")}
              </label>
              <input 
                type="date"
                value={selectedStudy?.endDate || ""}
                onChange={(e) => setSelectedStudy({ ...selectedStudy, endDate: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 ml-2">
              {t("description")}
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-300" size={16} />
              <textarea 
                value={selectedStudy?.description || ""}
                onChange={(e) => setSelectedStudy({ ...selectedStudy, description: e.target.value })}
                rows={3}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-zoco-lime/20 focus:border-zoco-lime transition-all font-semibold text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              {t("cancel")}
            </button>
            <button 
              type="submit"
              disabled={formLoading}
              className="flex-1 py-3.5 rounded-2xl bg-zoco-lime text-zoco-navy font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {formLoading && <Loader2 className="animate-spin" size={14} />}
              {t("save")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title={t("delete")}
        message={`${t("deleteConfirm")} "${studyToDelete?.title}"?`}
      />
    </div>
  );
};
