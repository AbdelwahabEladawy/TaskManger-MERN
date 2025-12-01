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


export default function AdminDashboard() {
    useUserAuth();
    const { user } = useContext(userContext);
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null)
    const [pieChartData, setPieChartData] = useState()
    const [barChartData, setBarChartData] = useState()

    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.DASHBOARD_DATA);
            if (response.data) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

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
                        label="Pending Tasks"
                        value={addThousandSeparators(dashboardData?.charts.taskDistribution?.inprogress || 0)}
                        color="bg-cyan-500"


                    />
                    <InfoCard
                        label="Pending Tasks"
                        value={addThousandSeparators(dashboardData?.charts.taskDistribution?.completed || 0)}
                        color="bg-lime-500"


                    />

                </div>
            </div>
        </DashboardLayout>
    )
}
