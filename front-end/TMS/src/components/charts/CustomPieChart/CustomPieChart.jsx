import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import CustomTooltip from '../CustomTooltip/CustomTooltip'
import CustomLegend from '../CustomLegend/CustomLegend'

function CustomPieChart({ data, color, label }) {
    return (
        <div>
            <ResponsiveContainer width="100%" height={325}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        innerRadius={100}
                        labelLine={false}

                    >
                        {data?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={color[index % color.length]} />
                        ))}

                    </Pie>
                    <Tooltip content={<CustomTooltip/>} />
                    <Legend content={<CustomLegend/>} />
                </PieChart>
            </ResponsiveContainer>



        </div>
    )
}

export default CustomPieChart
