import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { API_BASE_URL } from '../config';

const Report = () => {
  const [messages, setMessages] = useState([]);
  const [clickLogs, setClickLogs] = useState([]);
  const [credentialLogs, setCredentialLogs] = useState([]);
  const [groupedLogs, setGroupedLogs] = useState({});
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topTemplate, setTopTemplate] = useState("Нет данных");
  const [topCredentialTemplate, setTopCredentialTemplate] = useState("Нет данных");
  const [topClickGroup, setTopClickGroup] = useState("Нет данных");
  const [topCredentialGroup, setTopCredentialGroup] = useState("Нет данных");
  const [topClickedSubject, setTopClickedSubject] = useState("Нет данных");
  const [topCredentialSubject, setTopCredentialSubject] = useState("No Data");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messageResponse, clickResponse, credentialResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/messages/`),  
          fetch(`${API_BASE_URL}/api/click_logs/`),
          fetch(`${API_BASE_URL}/api/credential_logs/`)
        ]);
  
        if (!messageResponse.ok || !clickResponse.ok || !credentialResponse.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const [messageData, clickData, credentialData] = await Promise.all([
          messageResponse.json(),
          clickResponse.json(),
          credentialResponse.json()
        ]);
  
        setMessages(messageData);
        setClickLogs(clickData);
        setCredentialLogs(credentialData);

        const templateClicks = {};
        const templateCredentials = {};
        const groupClicks = {};
        const groupCredentials = {};
        const groupedData = {};
        const platformClicks = {};
        const platformCredentials = {};
        const subjectClicks = {};
        const subjectCredentials = {};

        messageData.forEach((message) => {
          const campaign = message.campaign_name;
          const template = message.subject;
          const group = message.recipient_group.name;


          if (!templateClicks[template]) templateClicks[template] = 0;
          if (!templateCredentials[template]) templateCredentials[template] = 0;
          if (!groupClicks[group]) groupClicks[group] = 0;
          if (!groupCredentials[group]) groupCredentials[group] = 0;
          

          clickData.forEach(log => {
            const platform = log.platform || "unknown";
            platformClicks[platform] = (platformClicks[platform] || 0) + 1;

            const message = messageData.find(msg => msg.id === log.message);
            if (message) {
              subjectClicks[message.subject] = (subjectClicks[message.subject] || 0) + 1;
            }

          });

          credentialData.forEach(log => {
            const platform = log.platform || "unknown";
            platformCredentials[platform] = (platformCredentials[platform] || 0) + 1;

            const message = messageData.find(msg => msg.id === log.message);
            if (message) {
              subjectCredentials[message.subject] = (subjectCredentials[message.subject] || 0) + 1;
            }

          });
          
          if (!groupedData[campaign]) {
            groupedData[campaign] = {
              name: campaign,
              totalRecipients: 0,
              uniqueClickUsers: new Set(),
              uniqueCredentialUsers: new Set()
            };
          }
          const recipients = message.recipients || [];
  
          groupedData[campaign].totalRecipients += recipients.length;
  
          recipients.forEach((recipient) => {
            clickData.forEach(log => {
              if (log.recipient?.id === recipient.id && log.message === message.id) {  
                groupedData[campaign].uniqueClickUsers.add(recipient.id);
              }
            });
  
            credentialData.forEach(log => {
              if (log.recipient?.id === recipient.id && log.message === message.id) {  
                groupedData[campaign].uniqueCredentialUsers.add(recipient.id);
              }
            });
          });
        });
  
        Object.keys(groupedData).forEach(campaign => {
          groupedData[campaign].uniqueClickUsers = groupedData[campaign].uniqueClickUsers.size;
          groupedData[campaign].uniqueCredentialUsers = groupedData[campaign].uniqueCredentialUsers.size;
        });
  

        setTopTemplate(Object.keys(platformClicks).reduce((a, b) => platformClicks[a] > platformClicks[b] ? a : b, "Нет данных"));
        setTopCredentialTemplate(Object.keys(platformCredentials).reduce((a, b) => platformCredentials[a] > platformCredentials[b] ? a : b, "Нет данных"));
        setTopClickGroup(Object.keys(groupClicks).reduce((a, b) => groupClicks[a] > groupClicks[b] ? a : b, "Нет данных"));
        setTopCredentialGroup(Object.keys(groupCredentials).reduce((a, b) => groupCredentials[a] > groupCredentials[b] ? a : b, "Нет данных"));
        setTopClickedSubject(Object.keys(subjectClicks).reduce((a, b) => subjectClicks[a] > subjectClicks[b] ? a : b, "Нет данных"));
        setTopCredentialSubject(Object.keys(subjectCredentials).reduce((a, b) => subjectCredentials[a] > subjectCredentials[b] ? a : b, "No Data"));

        setGroupedLogs(groupedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  const COLORS = ["#7b8bff", "#242c6c"];

  return (
    <Container maxWidth="lg" sx={{ marginBottom: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", marginBottom: 3 }}>
          Campaign Report Overview
        </Typography>

        {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <>


            <Grid container spacing={3} sx={{ marginBottom: 3, justifyContent: "center" }}>
              {[
                { label: "Most Clicked Platform", value: topTemplate },
                { label: "Most Clicked Group", value: topClickGroup },
                { label: "Most Clicked Email Subject", value: topClickedSubject },
                { label: "Most Credential Submissions Platform", value: topCredentialTemplate },
                { label: "Most Credential Submission Group", value: topCredentialGroup },               
                { label: "Most Credential Submission Email Subject", value: topCredentialSubject }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    background: "#f0f4f8", 
                    color: "#333", 
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.03)" }
                  }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ opacity: 0.7, color: "#555" }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#354d78", marginTop: 1 }}>
                        {item.value || "N/A"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>



            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
              Select a Campaign:
            </Typography>
            <Grid container spacing={2} justifyContent="center">
            {Object.entries(groupedLogs)
              .sort(([, a], [, b]) => (a.id || 0) - (b.id || 0))
              .map(([campaign, data]) => (
                <Grid item key={campaign}>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedCampaign(campaign)}
                    sx={{
                      background: "#354d78",
                      color: "#fff",
                      "&:hover": { background: "linear-gradient(135deg, #01102c, #9fb7d3)" }
                    }}
                  >
                    {campaign}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {selectedCampaign && groupedLogs[selectedCampaign] && (
              <>
                <Typography variant="h5" align="center" sx={{ marginTop: 4 }}>
                  Report for Campaign: {groupedLogs[selectedCampaign].name}
                </Typography>

                <Grid container spacing={3} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" align="center">User Interactions</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { name: "Clicked", value: groupedLogs[selectedCampaign].uniqueClickUsers, color: "url(#barClicked)" },
                        { name: "Not Clicked", value: groupedLogs[selectedCampaign].totalRecipients - groupedLogs[selectedCampaign].uniqueClickUsers, color: "url(#barGray)" },
                        { name: "Submitted", value: groupedLogs[selectedCampaign].uniqueCredentialUsers, color: "url(#barSubmitted)" },
                        { name: "Not Submitted", value: groupedLogs[selectedCampaign].totalRecipients - groupedLogs[selectedCampaign].uniqueCredentialUsers, color: "url(#barGray)" }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        
                        {/* Градиенты для цветов */}
                        <defs>
                          <linearGradient id="barClicked" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#01102c" />
                            <stop offset="100%" stopColor="#9fb7d3" />
                          </linearGradient>
                          <linearGradient id="barSubmitted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0e3a5e" />
                            <stop offset="100%" stopColor="#50d6db" />
                          </linearGradient>
                          <linearGradient id="barGray" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#b0b0b0" />
                            <stop offset="100%" stopColor="#808080" />
                          </linearGradient>
                        </defs>

                        {/* Отрисовка столбцов с разными цветами */}
                        <Bar dataKey="value">
                          {[
                            { name: "Clicked", gradient: "url(#barClicked)" },
                            { name: "Not Clicked", gradient: "url(#barGray)" },
                            { name: "Submitted", gradient: "url(#barSubmitted)" },
                            { name: "Not Submitted", gradient: "url(#barGray)" }
                          ].map((item, index) => (
                            <Cell key={`bar-${index}`} fill={item.gradient} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Grid>


                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" align="center">
                      Click vs Submission Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        {/* Определяем градиенты */}
                        <defs>
                          <linearGradient id="clickedGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#01102c" />
                            <stop offset="100%" stopColor="#9fb7d3" />
                          </linearGradient>
                          <linearGradient id="submittedGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#0e3a5e" />
                            <stop offset="100%" stopColor="#50d6db" />
                          </linearGradient>
                          <linearGradient id="noActivityGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#d3d3d3" />
                            <stop offset="100%" stopColor="#a9a9a9" />
                          </linearGradient>
                        </defs>

                        {/* Формируем данные для графика */}
                        {groupedLogs[selectedCampaign] ? (
                          (() => {
                            const clicked = groupedLogs[selectedCampaign].uniqueClickUsers;
                            const submitted = groupedLogs[selectedCampaign].uniqueCredentialUsers;
                            const total = groupedLogs[selectedCampaign].totalRecipients;
                            const noActivity = total - clicked - submitted;

                            const data = [
                              { name: "Clicked", value: clicked },
                              { name: "Submitted", value: submitted }
                            ];

                            // Если все значения равны 0, добавляем "No Activity"
                            if (clicked === 0 && submitted === 0) {
                              data.push({ name: "No Activity", value: 1 });
                            } else if (noActivity > 0) {
                              data.push({ name: "No Activity", value: noActivity });
                            }

                            return (
                              <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label
                              >
                                <Cell key="cell-clicked" fill="url(#clickedGradient)" />
                                <Cell key="cell-submitted" fill="url(#submittedGradient)" />
                                <Cell key="cell-no-activity" fill="url(#noActivityGradient)" />
                              </Pie>
                            );
                          })()
                        ) : (
                          <Pie
                            data={[{ name: "No Data", value: 1 }]}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label
                          >
                            <Cell key="cell-no-data" fill="#d3d3d3" />
                          </Pie>
                        )}

                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Grid>


                </Grid>

                <Typography variant="h6" sx={{ marginTop: 4 }}>
                  Summary Table
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Campaign Name</strong></TableCell>
                        <TableCell><strong>Total Recipients</strong></TableCell>
                        <TableCell><strong>Clicked (%)</strong></TableCell>
                        <TableCell><strong>Submitted (%)</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{groupedLogs[selectedCampaign].name}</TableCell>
                        <TableCell>{groupedLogs[selectedCampaign].totalRecipients}</TableCell>
                        <TableCell>{((groupedLogs[selectedCampaign].uniqueClickUsers / groupedLogs[selectedCampaign].totalRecipients) * 100).toFixed(2)}%</TableCell>
                        <TableCell>{((groupedLogs[selectedCampaign].uniqueCredentialUsers / groupedLogs[selectedCampaign].totalRecipients) * 100).toFixed(2)}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Report;






