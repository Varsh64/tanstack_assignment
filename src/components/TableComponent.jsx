import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { getTaxes } from "../services/api";
import EditModal from "./EditModal";
import "../index.css";

function TableComponent() {
  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getTaxes();
    setData(res.data);
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: "Entity",
      cell: (info) => (
        <span className="entity-link">
          {info.getValue() ?? "—"}
        </span>
      ),
    }),
    columnHelper.accessor("gender", {
      header: "Gender",
      cell: (info) => {
        const genderRaw = info.getValue();
        const gender = typeof genderRaw === "string" ? genderRaw.trim().toLowerCase() : "";
        const pillClass =
          gender === "male"
            ? "pill male"
            : gender === "female"
            ? "pill female"
            : "pill";
        return (
          <span className={pillClass}>
            {genderRaw ?? "—"}
          </span>
        );
      },
    }),
    columnHelper.accessor("requestDate", {
      header: "Request Date",
      cell: (info) => {
        const rawDate = info.getValue();
        let displayDate = "—";
        if (rawDate) {
          displayDate = rawDate;
          if (rawDate.includes("T")) {
            const d = new Date(rawDate);
            displayDate = d.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric"
            });
          } else if (rawDate.match(/^\d{2}-\d{2}-\d{2}$/)) {
            const [day, month, year] = rawDate.split("-");
            displayDate = new Date(`20${year}-${month}-${day}`).toLocaleDateString(
              undefined,
              { month: "short", day: "numeric", year: "numeric" }
            );
          }
        }
        return <span style={{ color: "#555" }}>{displayDate}</span>;
      },
    }),
    columnHelper.accessor("country", { header: "Country" }),
    columnHelper.display({
      id: "actions", // REQUIRED for icon-only or JSX header columns
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => setEditRow(row.original)}
          className="icon-btn"
          title="Edit"
        >
          {/* Pencil SVG icon only */}
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
            <path
              d="M14.7 3.3a1 1 0 011.4 1.4l-1.1 1.1L13.3 4.4l1.4-1.1zm-1.1 1.1L5 13.9V16h2.1l8.6-8.6-2.1-2.1z"
              stroke="#7c71ea"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="main-bg flex items-center justify-center min-h-screen">
      <div className="table-container">
        <h1 style={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "18px" }}>
          Customer Management
        </h1>
        {editRow && (
          <EditModal data={editRow} onClose={() => setEditRow(null)} refresh={fetchData} />
        )}
        <table>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableComponent;
