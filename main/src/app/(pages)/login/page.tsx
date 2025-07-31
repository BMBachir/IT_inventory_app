"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/app/Context/AuthContext";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_PORT_URL;

const Page = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const jsonData = await response.json();
      if (jsonData === false) {
        alert("Email ou mot de passe incorrect");
        console.log(jsonData.message);
        return;
      }
      login(jsonData);
      router.push("/");
    } catch (error) {
      console.log("An error occurred----:", error);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const [activeTab, setActiveTab] = useState("login");
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-[360px] md:w-[500px] mx-auto max-h-screen my-auto pt-12 md:mt-12 "
    >
      <TabsList className="w-full flex justify-center bg-gray-100  p-[30px] ">
        <TabsTrigger value="login" className="text-2xl px-12 py-5">
          Se connecter
        </TabsTrigger>
        <TabsTrigger value="register" className="text-2xl px-10  py-5">
          S&apos;inscrire
        </TabsTrigger>
      </TabsList>

      {/* 🔹 Login Form */}
      <TabsContent value="login">
        <Card className="h-auto w-full mx-auto mt-6 p-6 ">
          <form onSubmit={handleLoginSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="votre@email.com"
                  required
                  className="p-6 text-lg"
                  onChange={handleOnChange}
                  value={formData.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">
                  Mot de passe
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  required
                  className="p-6 text-lg"
                  onChange={handleOnChange}
                  value={formData.password}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center mt-8">
              <Button className="w-full p-6 text-[1.2rem]" type="submit">
                Se connecter
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="register">
        <Card className="h-auto w-full mt-6 p-6">
          <div>
            <div className="flex justify-center items-center transition-all duration-500 mt-10 mb-10 ">
              <p className="text-lg flex flex-col items-center justify-center text-center gap-4 text-red-700 bg-red-50 border-2 border-dotted border-red-200 hover:text-red-600 hover:border-red-600 cursor-pointer p-4 rounded-2xl transition-all duration-500">
                Seuls les administrateurs peuvent créer de nouveaux utilisateurs
                <ShieldAlert size={43} />
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Page;
