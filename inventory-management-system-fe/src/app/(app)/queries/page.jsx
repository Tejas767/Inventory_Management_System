/**
 * Queries Page — Manages asset repair requests and queries.
 */

"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import QueryList from "@/features/queries/QueryList";
import AddQueryModal from "@/features/queries/AddQueryModal";
import { queryService } from "@/services/queryService";
import { toQueryStatusEnum } from "@/utils/helpers";

export default function QueriesPage() {
  const [queries, setQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Open");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchQueries = async () => {
    try {
      const data = await queryService.getQueries();
      setQueries(data);
    } catch (err) {
      console.error("Error fetching queries:", err);
      setQueries([]);
    }
  };

  useEffect(() => { fetchQueries(); }, []);

  const handleUpdateStatus = async (id, displayStatus) => {
    try {
      await queryService.updateQueryStatus(id, toQueryStatusEnum(displayStatus));
      fetchQueries();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredQueries = searchTerm
    ? queries.filter((q) =>
        (q.employee || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.asset || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : queries;

  return (
    <section className="page-enter">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 page-enter-content">
        <PageHeader
          title="Queries"
          description="Manage asset repair requests and employee queries"
          action={
            <Button icon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
              Add Query
            </Button>
          }
        />

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search queries by employee, asset, or issue..."
        />

        <QueryList
          queries={filteredQueries}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onUpdateStatus={handleUpdateStatus}
        />

        <AddQueryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onQueryAdded={fetchQueries}
        />
      </div>
    </section>
  );
}
