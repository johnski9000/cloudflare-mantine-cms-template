"use client";
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Alert,
} from "@mantine/core";
import { MdError } from "react-icons/md";
import classes from "./AuthenticationImage.module.css";
import React, { useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthenticationImage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget?.value || e.target?.value || "";
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear error when user starts typing
      if (error) setError("");
    };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget?.checked || e.target?.checked || false;
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    // if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    //   setError("Please enter a valid email address");
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username: formData.email, // or email: formData.email depending on your backend
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      if (result?.ok) {
        // Successful login - redirect to dashboard or intended page
        router.push("/admin"); // Adjust redirect path as needed
        router.refresh(); // Ensure the page refreshes to update auth state
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        // User is already logged in, redirect to admin page
        router.push("/admin");
        router.refresh(); // Ensure the page refreshes to update auth state
      }
    };
    checkSession();
  }, []);

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <Title order={2} className={classes.title}>
          Welcome back!
        </Title>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert
              icon={<MdError size="1rem" />}
              title="Error"
              color="red"
              mb="md"
            >
              {error}
            </Alert>
          )}

          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            value={formData.email}
            onChange={(event) => handleInputChange("email")(event)}
            size="md"
            radius="md"
            required
            // type="email"
            disabled={isLoading}
            error={error && !formData.email.trim() ? "Email is required" : ""}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={formData.password}
            onChange={(event) => handleInputChange("password")(event)}
            mt="md"
            size="md"
            radius="md"
            required
            disabled={isLoading}
            error={
              error && !formData.password.trim() ? "Password is required" : ""
            }
          />

          <Checkbox
            label="Keep me logged in"
            mt="xl"
            size="md"
            checked={formData.rememberMe}
            onChange={handleCheckboxChange}
            disabled={isLoading}
          />

          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="md"
            radius="md"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Text ta="center" mt="md" size="sm" c="dimmed">
          Don&apos;t have an account?{" "}
          <Anchor href="/register" fw={500}>
            Create one here
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
