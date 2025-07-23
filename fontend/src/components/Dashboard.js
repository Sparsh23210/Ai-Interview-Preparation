import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; 
import dayjs from "dayjs";
import Navbar from "./Navbar";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [averages, setAverages] = useState({ day7: {}, day15: {}, day30: {} });
  const [streak, setStreak] = useState(0);
  const [lastPracticed, setLastPracticed] = useState(null);
  const [dailyPerformanceData, setDailyPerformanceData] = useState([]);

  useEffect(() => {
    const fetchPerformance = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const perfRef = collection(db, "users", user.uid, "performance");
      const perfSnap = await getDocs(perfRef);

      const allData = [];
      perfSnap.forEach((doc) => {
        const data = doc.data();
        allData.push({
          ...data,
          fluency: data.wpm,
          date: dayjs(doc.id).format("DD MMM"),
        });
      });

      const calculateAverages = (days) => {
        const cutoff = dayjs().subtract(days, "day");
        const filtered = allData.filter((p) => dayjs(p.date, "DD MMM").isAfter(cutoff));
        if (filtered.length === 0) return { grammar: 0, wpm: 0 };

        const grammar = filtered.reduce((sum, x) => sum + x.grammar, 0) / filtered.length;
        const wpm = filtered.reduce((sum, x) => sum + x.wpm, 0) / filtered.length;

        return {
          grammar: Math.round(grammar),
          wpm: Math.round(wpm),
        };
      };

      setDailyPerformanceData(allData);
      setAverages({
        day7: calculateAverages(7),
        day15: calculateAverages(15),
        day30: calculateAverages(30),
      });
    };

    const fetchStreak = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data().streak || {};
        setStreak(data.currentStreak || 0);
        setLastPracticed(data.lastPracticed || null);
      }
    };

    fetchPerformance();
    fetchStreak();
  }, []);

  const averageChartData = [
    { label: "7 Days", ...averages.day7 },
    { label: "15 Days", ...averages.day15 },
    { label: "30 Days", ...averages.day30 },
  ];

  return (<>
  <Navbar/>
    <Container className="mt-5 py-3">
      <div className="d-flex justify-content-center align-items-center shadow mb-2 rounded-4"><h2 className=" d-flex align-items-center ">
        Your Dashboard
        
      </h2></div>

      <Card className="mb-4">
        <Card.Body>
          <h4>🔥 Daily Streak</h4>
          <p>Current Streak: {streak} days</p>
          {lastPracticed && (
            <p className="text-muted">Last practiced on: {dayjs(lastPracticed).format("DD MMM YYYY")}</p>
          )}
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h5>🗓️ 7-Day Avg</h5>
              <p>Grammar: {averages.day7.grammar}</p>
              <p>WPM: {averages.day7.wpm}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h5>15-Day Avg</h5>
              <p>Grammar: {averages.day15.grammar}</p>
              <p>WPM: {averages.day15.wpm}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h5> 30-Day Avg</h5>
              <p>Grammar: {averages.day30.grammar}</p>
              <p>WPM: {averages.day30.wpm}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Daily Grammar & Fluency</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="grammar" fill="#8884d8" />
              <Bar dataKey="fluency" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h5 className="mb-3"> Grammar & WPM Averages</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={averageChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="grammar" fill="#8884d8" />
              <Bar dataKey="wpm" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Container></>
  );
};

export default Dashboard;
