'use client'

import React from 'react'
import type { TableProps } from '@/app/types/common'

const Table = ({ title, showTitle = false, columns, rows }: TableProps) => {
  return (
    <div className="w-full">
      {showTitle && title && (
        <h3 className="font-bold text-20 text-gray-003 mb-4">
          {title}
        </h3>
      )}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-002">
              {columns.map((column) => {
                const alignClass = column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                return (
                  <th
                    key={column.key}
                    className={`px-4 py-3 font-bold text-14 text-gray-003 ${alignClass}`}
                  >
                    {column.label}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-002 hover:bg-gray-002/50 transition-colors"
              >
                {columns.map((column) => {
                  const alignClass = column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                  return (
                    <td
                      key={column.key}
                      className={`px-4 py-3 font-regular text-16 text-gray-003 ${alignClass}`}
                    >
                      {row[column.key]}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table

