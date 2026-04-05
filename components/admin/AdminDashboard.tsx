"use client";

import { useState } from "react";
import { 
  Users, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter,
  ShieldCheck,
  ChevronRight,
  Database,
  Mail,
  Building,
  Activity,
  User as UserIcon
} from "lucide-react";
import { Avatar, Tabs } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdminDashboardProps {
  initialUsers: any[];
  initialLeads: any[];
  initialPendingProjects?: any[];
}

export function AdminDashboard({ initialUsers, initialLeads, initialPendingProjects = [] }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("leads");
  const [users, setUsers] = useState(initialUsers);
  const [leads, setLeads] = useState(initialLeads);
  const [pendingProjects, setPendingProjects] = useState(initialPendingProjects);
  const [search, setSearch] = useState("");

  const toggleVetted = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/vet`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVetted: !currentStatus })
      });
      
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, isVetted: !currentStatus } : u));
        toast.success(`Personnel ${!currentStatus ? "Vetted" : "Unvetted"}`);
      }
    } catch (err) {
      toast.error("Vetting failed");
    }
  };

  const approveProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true })
      });
      
      if (res.ok) {
        setPendingProjects(pendingProjects.filter(p => p.id !== projectId));
        toast.success("Project Approved & Live");
      }
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const rejectProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/approve`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        setPendingProjects(pendingProjects.filter(p => p.id !== projectId));
        toast.success("Project Rejected");
      }
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        setLeads(leads.map(l => l.id === leadId ? { ...l, status } : l));
        toast.success(`Lead status: ${status}`);
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-end gap-6 mb-12">
        <div className="flex-1">
          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tabs.List className="gap-6 w-full relative rounded-none p-0 border-b border-divider flex items-end">
              <Tabs.Tab id="leads" className="max-w-fit px-0 h-12 flex items-center justify-center cursor-pointer data-[selected=true]:text-[#7C5CFC] font-black uppercase text-[10px] tracking-widest relative">
                Consulting Leads
                {activeTab === "leads" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C5CFC]" />}
              </Tabs.Tab>
              <Tabs.Tab id="users" className="max-w-fit px-0 h-12 flex items-center justify-center cursor-pointer data-[selected=true]:text-[#7C5CFC] font-black uppercase text-[10px] tracking-widest relative">
                Personnel Vetting
                {activeTab === "users" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C5CFC]" />}
              </Tabs.Tab>
              <Tabs.Tab id="projects" className="max-w-fit px-0 h-12 flex items-center justify-center cursor-pointer data-[selected=true]:text-[#7C5CFC] font-black uppercase text-[10px] tracking-widest relative">
                Project Verification
                {activeTab === "projects" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C5CFC]" />}
              </Tabs.Tab>
              <Tabs.Tab id="analytics" className="max-w-fit px-0 h-12 flex items-center justify-center cursor-pointer data-[selected=true]:text-[#7C5CFC] font-black uppercase text-[10px] tracking-widest relative">
                Network Pulse
                {activeTab === "analytics" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C5CFC]" />}
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel id="leads" className="mt-8">
              <div className="grid grid-cols-1 gap-6">
                 {leads.length > 0 ? leads.map((lead) => (
                   <div key={lead.id} className="group rounded-[36px] bg-white border border-zinc-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 transition-all hover:shadow-xl hover:border-[#7C5CFC]/20">
                      <div className="flex items-center gap-6">
                         <div className="h-16 w-16 rounded-[24px] bg-[#7C5CFC]/5 flex items-center justify-center text-[#7C5CFC]">
                            <Building className="h-8 w-8" />
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-syne text-xl font-black text-zinc-900">{lead.companyName}</h3>
                              <Badge variant="secondary" className="scale-75 origin-left">{lead.status}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                               <span className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /> {lead.contactName}</span>
                               <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {lead.email}</span>
                               <span className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5" /> {lead.budgetRange}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col md:items-end flex-1 md:px-12">
                         <p className="text-sm font-medium text-zinc-500 leading-relaxed italic line-clamp-2 max-w-xl">
                            "{lead.description}"
                         </p>
                         <span className="text-[9px] font-bold text-[#7C5CFC] mt-2 uppercase tracking-widest">Requested: {new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                         <Button size="sm" variant="outline" className="rounded-xl font-bold uppercase text-[9px] tracking-widest border-zinc-100 hover:bg-zinc-50" onClick={() => updateLeadStatus(lead.id, "PROCESSING")}>Process</Button>
                         <Button size="sm" className="bg-zinc-900 text-white rounded-xl font-bold uppercase text-[9px] tracking-widest hover:bg-[#7C5CFC]" onClick={() => updateLeadStatus(lead.id, "COMPLETED")}>Finalize</Button>
                      </div>
                   </div>
                 )) : (
                   <div className="py-32 text-center rounded-[60px] border border-dashed border-zinc-200 opacity-30">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
                      <p className="font-syne text-xl font-bold uppercase tracking-widest">Awaiting Consulting Signal</p>
                   </div>
                 )}
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="projects" className="mt-8">
              <div className="grid grid-cols-1 gap-6">
                 {pendingProjects.length > 0 ? pendingProjects.map((project) => (
                   <div key={project.id} className="group rounded-[36px] bg-white border border-zinc-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 transition-all hover:shadow-xl hover:border-[#7C5CFC]/20">
                      <div className="flex items-center gap-6">
                         <div className="h-16 w-16 rounded-[24px] bg-[#7C5CFC]/5 flex items-center justify-center text-[#7C5CFC]">
                            <Zap className="h-8 w-8" />
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-syne text-xl font-black text-zinc-900">{project.title}</h3>
                              <Badge variant="outline" className="scale-75 origin-left text-amber-600 bg-amber-50">PENDING VERIFICATION</Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                               <span className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5" /> {project.company?.name || "Lab Hub"}</span>
                               <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col md:items-end flex-1 md:px-12">
                         <p className="text-sm font-medium text-zinc-500 leading-relaxed italic line-clamp-2 max-w-xl">
                            "{project.description}"
                         </p>
                      </div>

                      <div className="flex items-center gap-2">
                         <Button size="sm" variant="outline" className="rounded-xl font-bold uppercase text-[9px] tracking-widest border-zinc-100 hover:bg-zinc-50" onClick={() => rejectProject(project.id)}>Reject</Button>
                         <Button size="sm" className="bg-[#7C5CFC] text-white border-0 rounded-xl font-bold uppercase text-[9px] tracking-widest shadow-lg shadow-[#7C5CFC]/20" onClick={() => approveProject(project.id)}>Verify & Approve</Button>
                      </div>
                   </div>
                 )) : (
                   <div className="py-32 text-center rounded-[60px] border border-dashed border-zinc-200 opacity-30">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-emerald-500" />
                      <p className="font-syne text-xl font-bold uppercase tracking-widest">Queue Clear</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">All research briefs verified</p>
                   </div>
                 )}
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="users" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredUsers.map((user) => (
                   <div key={user.id} className="rounded-[40px] bg-white border border-zinc-100 p-8 transition-all hover:shadow-xl relative overflow-hidden group">
                      {user.isVetted && <div className="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle_at_100%_0%,rgba(245,158,11,0.1),transparent_70%)] pointer-events-none" />}
                      
                      <div className="flex items-center gap-5 mb-8">
                         <Avatar className="h-14 w-14 rounded-2xl border border-zinc-50">
                            {user.avatar && <Avatar.Image src={user.avatar} className="object-cover" />}
                            <Avatar.Fallback className="bg-zinc-100 text-zinc-500 font-black">
                               {user.name?.slice(0, 2).toUpperCase()}
                            </Avatar.Fallback>
                         </Avatar>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <h4 className="font-syne text-lg font-black text-zinc-900 truncate max-w-[140px]">{user.name}</h4>
                               {user.isVetted && <ShieldCheck className="h-4 w-4 text-amber-500" />}
                            </div>
                            <Badge variant={user.role === "ENGINEER" ? "default" : "secondary"} className="scale-75 origin-left text-[9px] font-black">{user.role}</Badge>
                         </div>
                      </div>

                      <div className="space-y-4 mb-8">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vetting Status</span>
                            <span className={cn("text-[10px] font-black uppercase tracking-widest", user.isVetted ? "text-amber-600" : "text-zinc-300")}>
                               {user.isVetted ? "Standalone Vetted" : "Unverified Signal"}
                            </span>
                         </div>
                      </div>

                      <Button 
                         className={cn(
                           "w-full rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest transition-all",
                           user.isVetted 
                             ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20 shadow-none" 
                             : "bg-zinc-900 text-white hover:bg-[#7C5CFC]"
                         )}
                         onClick={() => toggleVetted(user.id, !!user.isVetted)}
                      >
                         {user.isVetted ? "Revoke Signal" : "Grant Standex Vetted"}
                      </Button>
                   </div>
                 ))}
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="analytics" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 rounded-[48px] bg-zinc-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(124,92,252,0.1),transparent_70%)] pointer-events-none" />
                    <div className="flex items-center gap-4 mb-12">
                       <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#7C5CFC]">
                          <Zap className="h-6 w-6" />
                       </div>
                       <h4 className="font-syne text-2xl font-black">Managed Growth</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Implementation Leads</span>
                          <span className="text-4xl font-black">{leads.length}</span>
                       </div>
                       <div>
                          <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Vetted Engineers</span>
                          <span className="text-4xl font-black text-amber-500">{users.filter(u => u.isVetted && u.role === "ENGINEER").length}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-8 rounded-[48px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
                    <Activity className="h-10 w-10 mb-4 opacity-30" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Network Pulse Monitor Offline</p>
                 </div>
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
        
        <div className="w-full md:w-80 relative">
           <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Search className="h-4 w-4 text-zinc-400" />
           </div>
           <Input 
             placeholder="Search Identifier..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="bg-white pl-12 h-12 rounded-2xl border-zinc-100"
           />
        </div>
      </div>
    </div>
  );
}
