import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Brain,
  TrendingDown,
  Clock,
  Target,
  Upload,
  CheckCircle,
  Home,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const StudentDashboard = () => {
  const [stats] = useState({
    filesUploaded: 24,
    quizzesTaken: 12,
    weakTopics: 3,
    studyTime: "18h 32m",
  });

  const [uploadedFiles] = useState([
    {
      id: 1,
      name: "Calculus Notes - Chapter 5.pdf",
      date: "2 hours ago",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Biology Lab Report.docx",
      date: "5 hours ago",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "History Essay Draft.pdf",
      date: "1 day ago",
      size: "890 KB",
    },
  ]);

  const [quizResults] = useState([
    {
      id: 1,
      topic: "Calculus - Derivatives",
      score: 85,
      date: "3 hours ago",
      total: 100,
    },
    {
      id: 2,
      topic: "Biology - Cell Structure",
      score: 62,
      date: "1 day ago",
      total: 100,
    },
    {
      id: 3,
      topic: "Physics - Kinematics",
      score: 78,
      date: "2 days ago",
      total: 100,
    },
  ]);

  const lastUploadedFile = uploadedFiles[0];
  const lowestScoreQuiz = quizResults.reduce((lowest, quiz) =>
    quiz.score < lowest.score ? quiz : lowest
  );

  const StatCard = ({ icon: Icon, title, value, iconColor }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">StudyBuddy</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Study Materials">
                    <BookOpen />
                    <span>Study Materials</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Quizzes">
                    <Brain />
                    <span>Quizzes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Analytics">
                    <BarChart3 />
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 py-2 text-xs text-muted-foreground">
            StudyBuddy v1.0
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Student Dashboard</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back!
              </h2>
              <p className="text-gray-600 mt-1">
                Here's your learning overview.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={FileText}
                title="Files Uploaded"
                value={stats.filesUploaded}
                iconColor="text-blue-600"
              />
              <StatCard
                icon={Brain}
                title="Quizzes Taken"
                value={stats.quizzesTaken}
                iconColor="text-purple-600"
              />
              <StatCard
                icon={TrendingDown}
                title="Weak Topics"
                value={stats.weakTopics}
                iconColor="text-orange-600"
              />
              <StatCard
                icon={Clock}
                title="Study Time"
                value={stats.studyTime}
                iconColor="text-green-600"
              />
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  <CardTitle>Today's Focus</CardTitle>
                </div>
                <CardDescription>Areas that need your attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Upload className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Continue with last upload
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {lastUploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded {lastUploadedFile.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <TrendingDown className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Review weak topic
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {lowestScoreQuiz.topic}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Score: {lowestScoreQuiz.score}/{lowestScoreQuiz.total} •{" "}
                      {lowestScoreQuiz.date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle>Recent Uploads</CardTitle>
                  </div>
                  <CardDescription>Last 3 files you've uploaded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="p-2 bg-blue-100 rounded">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.date} • {file.size}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <CardTitle>Recent Quizzes</CardTitle>
                  </div>
                  <CardDescription>Last 3 quizzes you've taken</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quizResults.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                      >
                        <div
                          className={`p-2 rounded ${
                            quiz.score >= 80
                              ? "bg-green-100"
                              : quiz.score >= 70
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          }`}
                        >
                          <CheckCircle
                            className={`h-4 w-4 ${
                              quiz.score >= 80
                                ? "text-green-600"
                                : quiz.score >= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {quiz.topic}
                          </p>
                          <p className="text-xs text-gray-500">{quiz.date}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-bold ${
                              quiz.score >= 80
                                ? "text-green-600"
                                : quiz.score >= 70
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {quiz.score}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StudentDashboard;
