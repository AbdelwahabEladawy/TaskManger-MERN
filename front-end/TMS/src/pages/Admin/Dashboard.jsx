import React, { useContext } from 'react'
import useUserAuth from '../../hooks/useUserAuth';
import { userContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/dashboardLayout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axoisInstance'
import { useState, useEffect } from 'react';
import moment from 'moment';
import InfoCard from '../../components/cards/InfoCard';
import { addThousandSeparators } from '../../utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskList from '../../components/TaskList/TaskList';
import CustomPieChart from '../../components/charts/CustomPieChart/CustomPieChart';
import CustomBarChart from '../../components/charts/CustomBarChart/CustomBarChart';

const COLORS = ["#8D51ff", "#00b8db", "#7bce00"];
export default function AdminDashboard() {
    useUserAuth();
    const { user } = useContext(userContext);
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null)
    const [pieChartData, setPieChartData] = useState()
    const [barChartData, setBarChartData] = useState()




    const prepareChartData = (data) => {
        console.log("Data from API:", data);
        console.log("Priorities Object:", data?.taskPrioritiesLevel);
        const taskDistribution = data?.taskDistribution || null
        const taskPriorityLevel = data?.taskPrioritiesLevel || null

        const taskDistributionData = [
            { status: "pending", count: taskDistribution?.pending || 0 },
            { status: "completed", count: taskDistribution?.completed || 0 },
            { status: "in progress", count: taskDistribution?.inprogress || 0 }
        ]
        setPieChartData(taskDistributionData)

        const TaskPriorityLevel = [
            { priority: "low", count: taskPriorityLevel?.low || 0 },
            { priority: "medium", count: taskPriorityLevel?.medium || 0 },
            { priority: "high", count: taskPriorityLevel?.high || 0 },
        ]

        setBarChartData(TaskPriorityLevel)
    }

    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.DASHBOARD_DATA);
            if (response.data) {
                setDashboardData(response.data);
                prepareChartData(response.data?.charts || null)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const onSeeMore = () => {
        navigate("/admin/tasks")
    }

    useEffect(() => {
        getDashboardData();
        return () => { }
    }, [])





    return (
        <DashboardLayout activeMenu="dashboard">
            <div className="card my-5">
                <div>
                    <div className="col-span-3">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 ">Good Morning ! {user?.name}</h2>
                        <p className="text-sm md:text-[13px] text-slate-400 mt-1.5">
                            {moment().format('dddd, MMMM Do YYYY')}
                        </p>
                    </div>



                </div>





                <div className="grid grid-col-2  sm:grid-cols-2 gap-3 md:gap-6 mt-5">
                    <InfoCard
                        label="Total Tasks"
                        value={addThousandSeparators(dashboardData?.charts.taskDistribution?.all || 0)}
                        color="bg-primary"


                    />
                    <InfoCard
                        label="Pending Tasks"
                        value={addThousandSeparators(dashboardData?.charts.taskDistribution?.pending || 0)}
                        color="bg-violet-500"


                    />
                    <InfoCard
                        label="In Progress Tasks"
                        value={addThousandSeparators(dashboardData?.charts.taskDistribution?.inprogress || 0)}
                        color="bg-cyan-500"


                    />
                    <InfoCard
                        label="Completed Tasks"
                        value={addThousandSeparators(dashboardData?.charts.taskDistribution?.completed || 0)}
                        color="bg-lime-500"


                    />

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6  my-4 md-my-6">
                <div>
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <h5 className='font-medium '> Task Distribution </h5>
                        </div>
                        <CustomPieChart
                            data={pieChartData}
                            label={"total balance"}
                            color={COLORS}

                        />


                    </div>
                </div>
                <div>
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <h5 className='font-medium '> Task Priority Levels </h5>
                        </div>
                        <CustomBarChart
                            data={barChartData}
                            label={"total balance"}
                            color={COLORS}

                        />


                    </div>
                </div>






                <div className="md:col-span-2">
                    <div className="card">
                        <div className="flex items-center justify-between ">
                            <h5>Recent Tasks</h5>
                            <button className='card-btn' onClick={onSeeMore}>
                                See All <LuArrowRight className='text-base' />
                            </button>
                        </div>
                        <TaskList tableData={dashboardData?.recentTasks || []} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
