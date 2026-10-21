import { useEffect, useRef, useState } from "react";
import "./App.css";

const API = "http://localhost:8080";

const readJsonResponse = async (response, fallbackMessage) => {
  const body = await response.text();

  if (!body.trim()) {
    return null;
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error(fallbackMessage);
  }
};

// ---------------- SVG ICONS ----------------
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const VaultIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const SharedResourcesIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 17 4 12 9 7"/>
    <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
  </svg>
);

const SharedWithIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 17 20 12 15 7"/>
    <path d="M4 18v-2a4 4 0 0 1 4-4h12"/>
  </svg>
);

const TeamVaultIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const AlertsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const AuditLogsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const PasswordHealthIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

const LoginActivityIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const LogoutIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"/>
    <path d="M1 20v-6h6"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

function App() {
  // ---------------- STATE ----------------

  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("securevault_token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("securevault_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Login / Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Navigation module state (default: "vault")
  const [activeModule, setActiveModule] = useState("vault");

  // Vault
  const [vault, setVault] = useState(null);
  const [vaults, setVaults] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Credential form
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [credentialPassword, setCredentialPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingVaultId, setEditingVaultId] = useState(null);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);
  const [checkingStrength, setCheckingStrength] = useState(false);
  const strengthRequestId = useRef(0);

  // Password generator options
  const [genLength, setGenLength] = useState(16);
  const [genUppercase, setGenUppercase] = useState(true);
  const [genLowercase, setGenLowercase] = useState(true);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genSpecial, setGenSpecial] = useState(true);

  // Shared credentials
  const [sharedCredentials, setSharedCredentials] = useState([]);
  const [isYourVaultOpen, setIsYourVaultOpen] = useState(true);
  const [isSharedResourcesOpen, setIsSharedResourcesOpen] = useState(true);
  const [isSharedWithOpen, setIsSharedWithOpen] = useState(true);
  const [isSecurityAlertsOpen, setIsSecurityAlertsOpen] = useState(true);
  const [selectedSharedCredential, setSelectedSharedCredential] = useState(null);
  const [showSharedViewModal, setShowSharedViewModal] = useState(false);
  const [managedCredential, setManagedCredential] = useState(null);
  const [managedShares, setManagedShares] = useState([]);
  const [showManageSharesModal, setShowManageSharesModal] = useState(false);
  const [allCredentialShares, setAllCredentialShares] = useState([]);

  // Audit logs
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);

  // Security alerts
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [securityAlertsLoading, setSecurityAlertsLoading] = useState(false);

  // Team vault
  const [isTeamVaultOpen, setIsTeamVaultOpen] = useState(true);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState("");
  const [teamVaultError, setTeamVaultError] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);
  const [teamMembersError, setTeamMembersError] = useState("");
  const [teamVaultId, setTeamVaultId] = useState(null);
  const [teamCredentials, setTeamCredentials] = useState([]);
  const [teamCredentialsLoading, setTeamCredentialsLoading] = useState(false);
  const [teamCredentialsError, setTeamCredentialsError] = useState("");
  const [teamVaultLoading, setTeamVaultLoading] = useState(false);
  const [teamVaultMessage, setTeamVaultMessage] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [teamCredentialEditingId, setTeamCredentialEditingId] = useState(null);
  const [teamCredentialTitle, setTeamCredentialTitle] = useState("");
  const [teamCredentialUsername, setTeamCredentialUsername] = useState("");
  const [teamCredentialPassword, setTeamCredentialPassword] = useState("");
  const [teamCredentialUrl, setTeamCredentialUrl] = useState("");
  const [teamCredentialNotes, setTeamCredentialNotes] = useState("");
  const [teamMemberEmail, setTeamMemberEmail] = useState("");
  const [teamMemberPermission, setTeamMemberPermission] = useState("VIEW_ONLY");
  const [teamCredentialSourceId, setTeamCredentialSourceId] = useState("");
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [showEditTeamMemberModal, setShowEditTeamMemberModal] = useState(false);
  const [showAddTeamCredentialModal, setShowAddTeamCredentialModal] = useState(false);
  const [showManageTeamModal, setShowManageTeamModal] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);

  // Team credential password strength
  const [teamCredentialPasswordStrength, setTeamCredentialPasswordStrength] = useState(null);
  const [teamCredentialPasswordSuggestions, setTeamCredentialPasswordSuggestions] = useState([]);
  const [checkingTeamPasswordStrength, setCheckingTeamPasswordStrength] = useState(false);
  const teamPasswordRequestId = useRef(0);

  // Security analytics
  const [isSecurityAnalyticsOpen, setIsSecurityAnalyticsOpen] = useState(true);
  const [securityAnalytics, setSecurityAnalytics] = useState(null);
  const [securityAnalyticsError, setSecurityAnalyticsError] = useState("");
  const [securityAnalyticsLoading, setSecurityAnalyticsLoading] = useState(false);

  // Edit shared with modal
  const [showEditSharedModal, setShowEditSharedModal] = useState(false);
  const [editingShare, setEditingShare] = useState(null);
  const [editSharePermission, setEditSharePermission] = useState("VIEW_ONLY");

  // UI
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingId, setSharingId] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState("VIEW_ONLY");
  const [shareExpiresAt, setShareExpiresAt] = useState("");

  // ---------------- SESSION EXPIRATION HELPER ----------------

  const handleSessionExpired = (statusCode) => {
    if (statusCode === 401) {
      logout();
      setError("Session expired. Please log in again.");
      return true;
    }
    return false;
  };

  const loadCurrentUser = async (authToken) => {
    if (!authToken) return;
    try {
      const response = await fetch(`${API}/api/users/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const userData = await response.json();
        if (userData) {
          setUser(userData);
          localStorage.setItem("securevault_user", JSON.stringify(userData));
        }
      }
    } catch (err) {
      console.log("Could not load current user profile:", err);
    }
  };

  // ---------------- INITIAL LOAD ----------------

  useEffect(() => {
    const storedToken = localStorage.getItem("securevault_token");

    if (storedToken) {
      setToken(storedToken);
      setPage("vault");
      setActiveModule("vault");

      (async () => {
        await loadCurrentUser(storedToken);
        await loadVault(storedToken);
      })();
    }
  }, []);

  // Load shares whenever credentials change
  useEffect(() => {
    if (token && credentials.length > 0) {
      loadAllCredentialShares(token, credentials);
    }
  }, [credentials, token]);

  // Load audit logs when module selected
  useEffect(() => {
    if ((activeModule === "audit-logs" || activeModule === "login-activity") && token) {
      loadAuditLogs();
    }
  }, [activeModule, token]);

  // Load security alerts when module selected
  useEffect(() => {
    if (activeModule === "security-alerts" && token) {
      loadSecurityAlerts();
    }
  }, [activeModule, token]);

  // Load team vault data when module selected
  useEffect(() => {
    if (activeModule === "team-vault" && token) {
      loadTeams(token);
    }
  }, [activeModule, token]);

  // Load analytics when analytics or health module selected
  useEffect(() => {
    if ((activeModule === "security-analytics" || activeModule === "password-health") && token) {
      loadSecurityAnalytics(token);
    }
  }, [activeModule, token]);

  // Load selected team credentials when team selection changes
  useEffect(() => {
    if (activeModule !== "team-vault" || !token || !selectedTeamId) {
      return;
    }

    const selectedTeamItem = teams.find((team) => team.id === selectedTeamId);
    if (selectedTeamItem) {
      setSelectedTeam(selectedTeamItem);
      setTeamVaultId(resolveTeamVault(selectedTeamItem)?.id || null);
      clearTeamVaultForm();
      loadTeamMembers(selectedTeamItem.id, token);
      loadTeamCredentials(selectedTeamItem, token);
    }
  }, [selectedTeamId, teams, token, activeModule]);

  // ---------------- LOGIN ----------------

  const login = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const responseText = await response.text();
      let data = null;

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = { message: responseText.trim() };
        }
      }

      if (response.status === 423) {
        throw new Error(
          "Account temporarily locked due to multiple failed login attempts. Please try again after 5 minutes."
        );
      }

      if (!response.ok) {
        throw new Error("Invalid username or password.");
      }

      if (!data || !data.token) {
        throw new Error("Login response did not include a token.");
      }

      localStorage.setItem("securevault_token", data.token);
      setToken(data.token);

      const userData = {
        id: data.userId,
        fullName: data.fullName || email.split("@")[0],
        email: data.email || email,
      };

      setUser(userData);
      localStorage.setItem("securevault_user", JSON.stringify(userData));

      setPassword("");
      setPage("vault");
      setActiveModule("vault");

      await loadVault(data.token);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- REGISTER ----------------

  const register = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed");
      }

      setMessage("Registration successful. Please login.");
      setFullName("");
      setEmail("");
      setPassword("");
      setPage("login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOAD VAULT ----------------

  const loadVault = async (authToken) => {
    if (!authToken) {
      setError("Authentication token is missing.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/vaults`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (handleSessionExpired(response.status)) {
        return;
      }

      if (!response.ok) {
        const errorData = await readJsonResponse(response, "Unable to load vault");
        throw new Error(errorData?.message || errorData?.error || "Unable to load vault");
      }

      const vaultsData = await readJsonResponse(response, "Unable to load vault");

      if (!Array.isArray(vaultsData) || vaultsData.length === 0) {
        const createResponse = await fetch(`${API}/api/vaults`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            name: "My Personal Vault",
          }),
        });

        if (!createResponse.ok) {
          const errorData = await readJsonResponse(createResponse, "Unable to create vault");
          throw new Error(errorData?.message || errorData?.error || "Unable to create vault");
        }

        const newVault = await readJsonResponse(createResponse, "Unable to create vault");

        if (!newVault || typeof newVault.id === "undefined") {
          throw new Error("Unable to create vault");
        }

        setVault(newVault);
        setVaults([newVault]);
        await loadCredentials(newVault.id, authToken);
      } else {
        setVault(vaultsData[0]);
        setVaults(vaultsData);
        await loadCredentials(vaultsData[0].id, authToken);
      }

      await loadSharedCredentials(authToken);
      await loadSecurityAnalytics(authToken);
      await loadTeams(authToken);
      await loadSecurityAlerts(authToken);
      await loadAuditLogs(authToken);
    } catch (err) {
      console.error("Vault loading error:", err);
      setError(err.message);
      if (err.message.toLowerCase().includes("unauthorized")) {
        logout();
      }
    }
  };

  // ---------------- CHECK PASSWORD STRENGTH ----------------

  const checkPasswordStrength = async (pwd) => {
    const requestId = ++strengthRequestId.current;

    if (!pwd) {
      setPasswordStrength(null);
      setPasswordSuggestions([]);
      setCheckingStrength(false);
      return;
    }

    setCheckingStrength(true);

    try {
      const response = await fetch(`${API}/api/password/strength`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: pwd }),
      });

      if (handleSessionExpired(response.status)) {
        if (requestId === strengthRequestId.current) {
          setCheckingStrength(false);
        }
        return;
      }

      const responseBody = await response.text();
      let data = null;

      if (responseBody.trim()) {
        try {
          data = JSON.parse(responseBody);
        } catch {
          throw new Error("Password strength check failed");
        }
      }

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Password strength check failed");
      }

      if (requestId !== strengthRequestId.current || !data || typeof data.strength !== "string") {
        return;
      }

      setPasswordStrength(data.strength);
      setPasswordSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch (err) {
      console.error("Password strength error:", err);
      if (requestId === strengthRequestId.current) {
        setPasswordStrength(null);
        setPasswordSuggestions([]);
      }
    } finally {
      if (requestId === strengthRequestId.current) {
        setCheckingStrength(false);
      }
    }
  };

  // ---------------- GENERATE PASSWORD ----------------

  const generatePassword = async () => {
    try {
      const params = new URLSearchParams({
        length: genLength,
        uppercase: genUppercase,
        lowercase: genLowercase,
        numbers: genNumbers,
        special: genSpecial,
      });

      const response = await fetch(`${API}/api/password/generate?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      const responseBody = await response.text();
      let data = null;

      if (responseBody.trim()) {
        try {
          data = JSON.parse(responseBody);
        } catch {
          if (!response.ok) {
            setError("Password generation failed");
            return;
          }
          throw new Error("Invalid password generation response");
        }
      }

      if (!response.ok || !data || !data.password) {
        setError(data?.error || data?.message || "Password generation failed");
        return;
      }

      setError("");
      setCredentialPassword(data.password);
      await checkPasswordStrength(data.password);
      setMessage("Password generated successfully");
    } catch (err) {
      console.error("Generate password error:", err);
      setError(err.message || "Password generation failed");
    }
  };

  // Team Credential Password Strength Check
  const checkTeamCredentialPasswordStrength = async (pwd) => {
    const requestId = ++teamPasswordRequestId.current;

    if (!pwd) {
      setTeamCredentialPasswordStrength(null);
      setTeamCredentialPasswordSuggestions([]);
      setCheckingTeamPasswordStrength(false);
      return;
    }

    setCheckingTeamPasswordStrength(true);

    try {
      const response = await fetch(`${API}/api/password/strength`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: pwd }),
      });

      if (handleSessionExpired(response.status)) {
        if (requestId === teamPasswordRequestId.current) {
          setCheckingTeamPasswordStrength(false);
        }
        return;
      }

      const responseBody = await response.text();
      let data = null;

      if (responseBody.trim()) {
        try {
          data = JSON.parse(responseBody);
        } catch {
          throw new Error("Password strength check failed");
        }
      }

      if (!response.ok || !data || typeof data.strength !== "string") {
        return;
      }

      if (requestId === teamPasswordRequestId.current) {
        setTeamCredentialPasswordStrength(data.strength);
        setTeamCredentialPasswordSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      }
    } catch (err) {
      console.error("Team password strength error:", err);
      if (requestId === teamPasswordRequestId.current) {
        setTeamCredentialPasswordStrength(null);
        setTeamCredentialPasswordSuggestions([]);
      }
    } finally {
      if (requestId === teamPasswordRequestId.current) {
        setCheckingTeamPasswordStrength(false);
      }
    }
  };

  // Team Credential Generate Password
  const generateTeamCredentialPassword = async () => {
    try {
      const params = new URLSearchParams({
        length: genLength,
        uppercase: genUppercase,
        lowercase: genLowercase,
        numbers: genNumbers,
        special: genSpecial,
      });

      const response = await fetch(`${API}/api/password/generate?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      const responseBody = await response.text();
      let data = null;

      if (responseBody.trim()) {
        try {
          data = JSON.parse(responseBody);
        } catch {
          if (!response.ok) {
            setTeamVaultError("Password generation failed");
            return;
          }
          throw new Error("Invalid password generation response");
        }
      }

      if (!response.ok || !data || !data.password) {
        setTeamVaultError(data?.error || data?.message || "Password generation failed");
        return;
      }

      setTeamVaultError("");
      setTeamCredentialPassword(data.password);
      await checkTeamCredentialPasswordStrength(data.password);
      setTeamVaultMessage("Password generated successfully");
    } catch (err) {
      console.error("Generate team password error:", err);
      setTeamVaultError(err.message || "Password generation failed");
    }
  };

  // ---------------- LOAD SHARED CREDENTIALS ----------------

  const loadSharedCredentials = async (authToken) => {
    if (!authToken) return;

    try {
      const response = await fetch(`${API}/api/credentials/shared-with-me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      if (!response.ok) {
        setSharedCredentials([]);
        return;
      }

      const data = await readJsonResponse(response, "Unable to load shared credentials");
      setSharedCredentials(data || []);
    } catch (err) {
      console.error("Load shared credentials error:", err);
      setSharedCredentials([]);
    }
  };

  // ---------------- LOAD CREDENTIALS ----------------

  const loadCredentials = async (vaultId, authToken) => {
    if (!authToken) {
      setError("Authentication token is missing.");
      return;
    }

    try {
      const response = await fetch(`${API}/api/vaults/${vaultId}/credentials`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      if (!response.ok) {
        const errorData = await readJsonResponse(response, "Unable to load credentials");
        throw new Error(errorData?.message || errorData?.error || "Unable to load credentials");
      }

      const data = await readJsonResponse(response, "Unable to load credentials");
      if (!Array.isArray(data)) {
        throw new Error("Invalid credential response from server.");
      }

      setCredentials(data);
    } catch (err) {
      console.error("Credential loading error:", err);
      setError(err.message);
    }
  };

  // ---------------- LOAD ALL CREDENTIAL SHARES ----------------

  const loadAllCredentialShares = async (authToken, credentialsList) => {
    if (!authToken || !credentialsList || credentialsList.length === 0) {
      setAllCredentialShares([]);
      return;
    }

    try {
      const allShares = [];
      for (const credential of credentialsList) {
        try {
          const response = await fetch(`${API}/api/credentials/${credential.id}/shares`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.ok) {
            const shares = await readJsonResponse(response, "Unable to load credential shares");
            if (Array.isArray(shares)) {
              shares.forEach((share) => {
                allShares.push({
                  ...share,
                  credentialTitle: credential.title,
                  credentialId: credential.id,
                });
              });
            }
          }
        } catch (err) {
          console.error(`Error loading shares for credential ${credential.id}:`, err);
        }
      }

      setAllCredentialShares(allShares);
    } catch (err) {
      console.error("Error loading all credential shares:", err);
      setAllCredentialShares([]);
    }
  };

  // ---------------- ADD / UPDATE CREDENTIAL ----------------

  const saveCredential = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const vaultId = editingVaultId || vault?.id;

    if (!vaultId) {
      setError("Vault is not available.");
      return;
    }

    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    const credentialData = {
      title: title.trim(),
      username: username.trim(),
      password: credentialPassword,
      url: url.trim(),
      notes: notes.trim(),
    };

    setLoading(true);

    try {
      const urlPath = editingId
        ? `${API}/api/vaults/${vaultId}/credentials/${editingId}`
        : `${API}/api/vaults/${vaultId}/credentials`;

      const response = await fetch(urlPath, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(credentialData),
      });

      if (handleSessionExpired(response.status)) {
        setLoading(false);
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Operation failed");
      }

      setMessage(editingId ? "Credential updated successfully." : "Credential added successfully.");
      clearForm();

      if (editingVaultId) {
        await loadCredentials(editingVaultId, token);
        await loadSharedCredentials(token);
      } else {
        await loadCredentials(vault.id, token);
      }

      await loadSecurityAnalytics();
    } catch (err) {
      console.error("Save credential error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT ----------------

  const editCredential = (credential) => {
    setEditingId(credential.credentialId || credential.id);
    setEditingVaultId(credential.vaultId || null);

    setTitle(credential.title || "");
    setUsername(credential.username || "");
    setCredentialPassword(credential.password || "");
    setUrl(credential.url || "");
    setNotes(credential.notes || "");

    setMessage("");
    setError("");

    // Automatically switch to vault tab if editing personal credential
    if (activeModule !== "vault") {
      setActiveModule("vault");
    }
  };

  // ---------------- DELETE ----------------

  const deleteCredential = async (id, targetVaultIdParam = null) => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    const targetVaultId = targetVaultIdParam || vault?.id;

    if (!targetVaultId) {
      setError("Vault is not available.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this credential?")) {
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/vaults/${targetVaultId}/credentials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) {
        setLoading(false);
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Delete failed");
      }

      setMessage("Credential deleted successfully.");
      await loadCredentials(targetVaultId, token);
      await loadSharedCredentials(token);
      await loadSecurityAnalytics();
    } catch (err) {
      console.error("Delete credential error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CLEAR FORM ----------------

  const clearForm = () => {
    setEditingId(null);
    setEditingVaultId(null);
    setTitle("");
    setUsername("");
    setCredentialPassword("");
    setUrl("");
    setNotes("");
    setPasswordStrength(null);
    setPasswordSuggestions([]);
  };

  // ---------------- SHARE CREDENTIAL ----------------

  const openShareModal = (credentialId) => {
    setSharingId(credentialId);
    setShareEmail("");
    setSharePermission("VIEW_ONLY");
    setShareExpiresAt("");
    setShowShareModal(true);
    setError("");
    setMessage("");
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setSharingId(null);
    setShareEmail("");
    setSharePermission("VIEW_ONLY");
    setShareExpiresAt("");
  };

  const shareCredential = async (e) => {
    e.preventDefault();

    if (!sharingId || !token) {
      setError("Credential ID or authentication token is missing.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (user?.email && user.email.trim().toLowerCase() === shareEmail.trim().toLowerCase()) {
        throw new Error("You cannot share a credential with yourself.");
      }

      const shareData = {
        email: shareEmail.trim(),
        permission: sharePermission,
      };

      if (shareExpiresAt) {
        shareData.expiresAt = shareExpiresAt + ":00";
      }

      const response = await fetch(`${API}/api/credentials/${sharingId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shareData),
      });

      if (handleSessionExpired(response.status)) {
        setLoading(false);
        return;
      }

      const responseBody = await response.text();
      let data = {};
      if (responseBody.trim()) {
        try {
          data = JSON.parse(responseBody);
        } catch {
          data = { message: responseBody.trim() };
        }
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }

      setMessage(`Credential shared successfully with ${shareEmail} (${sharePermission})`);
      closeShareModal();
      await loadAllCredentialShares(token, credentials);
      await loadSecurityAnalytics();
    } catch (err) {
      console.error("Share credential error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewSharedCredential = async (credentialId) => {
    try {
      const response = await fetch(`${API}/api/credentials/${credentialId}/shared`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to view credential");
      }

      setSelectedSharedCredential(data);
      setShowSharedViewModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const openManageShares = async (credential) => {
    try {
      const response = await fetch(`${API}/api/credentials/${credential.credentialId}/shares`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to load shares");
      }

      setManagedCredential(credential);
      setManagedShares(data);
      setShowManageSharesModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateManagedShare = async (share) => {
    const perm = window.prompt("Enter permission: VIEW_ONLY, EDIT, or FULL_MANAGEMENT", share.permission);
    if (!perm) return;

    try {
      const response = await fetch(`${API}/api/credentials/${share.credentialId}/shares/${share.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permission: perm.toUpperCase() }),
      });

      if (handleSessionExpired(response.status)) return;

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to update share");
      }

      setManagedShares((currentShares) =>
        currentShares.map((currentShare) =>
          currentShare.id === share.id ? { ...currentShare, permission: perm.toUpperCase() } : currentShare
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const removeManagedShare = async (share) => {
    if (!window.confirm("Remove this credential share?")) return;

    try {
      const response = await fetch(`${API}/api/credentials/${share.credentialId}/shares/${share.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to remove share");
      }

      setManagedShares((currentShares) =>
        currentShares.filter((currentShare) => currentShare.id !== share.id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const removeSharedWithShare = async (share) => {
    if (!window.confirm("Remove this credential share?")) return;

    try {
      const response = await fetch(`${API}/api/credentials/${share.credentialId}/shares/${share.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to remove share");
      }

      setMessage("Share removed successfully");
      setAllCredentialShares((currentShares) =>
        currentShares.filter((currentShare) => currentShare.id !== share.id)
      );
      await loadSecurityAnalytics();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditSharedWithModal = (share) => {
    setEditingShare(share);
    setEditSharePermission(share.permission);
    setShowEditSharedModal(true);
    setError("");
    setMessage("");
  };

  const closeEditSharedWithModal = () => {
    setShowEditSharedModal(false);
    setEditingShare(null);
    setEditSharePermission("VIEW_ONLY");
  };

  const updateSharedWithShare = async (e) => {
    e.preventDefault();

    if (!editingShare || !token) {
      setError("Share or authentication token is missing.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API}/api/credentials/${editingShare.credentialId}/shares/${editingShare.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ permission: editSharePermission.toUpperCase() }),
        }
      );

      if (handleSessionExpired(response.status)) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to update share");
      }

      setMessage("Share permission updated successfully");
      setAllCredentialShares((currentShares) =>
        currentShares.map((currentShare) =>
          currentShare.id === editingShare.id
            ? { ...currentShare, permission: editSharePermission.toUpperCase() }
            : currentShare
        )
      );

      closeEditSharedWithModal();
      await loadAllCredentialShares(token, credentials);
    } catch (err) {
      console.error("Update share error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- AUDIT LOGS ----------------

  const formatActionLabel = (action) => {
    const labels = {
      LOGIN_SUCCESS: "Login Successful",
      LOGIN_FAILED: "Login Failed",
      CREDENTIAL_CREATED: "Credential Created",
      CREDENTIAL_UPDATED: "Credential Updated",
      CREDENTIAL_DELETED: "Credential Deleted",
      CREDENTIAL_ACCESSED: "Credential Accessed",
      CREDENTIAL_SHARED: "Credential Shared",
      SHARE_REMOVED: "Share Removed",
    };
    return labels[action] || action;
  };

  const loadAuditLogs = async () => {
    if (!token) return;

    setAuditLogsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/audit-logs/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) {
        setAuditLogsLoading(false);
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to load audit logs");
      }

      if (data.content && Array.isArray(data.content)) {
        setAuditLogs(data.content);
      } else if (Array.isArray(data)) {
        setAuditLogs(data);
      } else {
        setAuditLogs([]);
      }
    } catch (err) {
      console.error("Audit logs error:", err);
      setError(err.message);
    } finally {
      setAuditLogsLoading(false);
    }
  };

  const loadSecurityAlerts = async () => {
    if (!token) return;

    setSecurityAlertsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/security-alerts/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) {
        setSecurityAlertsLoading(false);
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Unable to load security alerts.");
      }

      setSecurityAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Security alerts error:", err);
      setError("Unable to load security alerts.");
    } finally {
      setSecurityAlertsLoading(false);
    }
  };

  const formatTeamPermission = (permission) => {
    if (!permission) return "-";
    const normalized = String(permission).toUpperCase();
    if (normalized === "VIEW_ONLY") return "View only";
    if (normalized === "EDIT") return "Edit";
    if (normalized === "FULL_MANAGEMENT") return "Full management";
    return normalized;
  };

  const getCurrentTeamPermission = (t) => {
    if (!t || !user?.email) return null;
    if (t.ownerEmail?.toLowerCase() === user.email.toLowerCase()) return "FULL_MANAGEMENT";

    const memberSource =
      selectedTeamId && t.id === selectedTeamId && Array.isArray(teamMembers) && teamMembers.length > 0
        ? teamMembers
        : Array.isArray(t.members)
        ? t.members
        : [];

    const member = memberSource.find(
      (m) => m.userEmail?.toLowerCase() === user.email.toLowerCase()
    );

    return member?.permission || null;
  };

  const isCurrentUserTeamOwner = (t) => {
    if (!t || !user?.email) return false;
    return t.ownerEmail?.toLowerCase() === user.email.toLowerCase();
  };

  const resolveTeamVault = (t) => {
    if (!t) return null;
    const teamVaultName = `Team Vault: ${t.name}`;
    return vaults.find((v) => v.name === teamVaultName) || null;
  };

  const openModule = (moduleKey) => {
    setActiveModule(moduleKey);
    setError("");
    setMessage("");

    if (moduleKey === "vault" && vault?.id && token) {
      loadCredentials(vault.id, token);
    } else if (moduleKey === "shared-resources" && token) {
      loadSharedCredentials(token);
    } else if (moduleKey === "shared-with" && token) {
      loadAllCredentialShares(token, credentials);
    } else if (moduleKey === "team-vault" && token) {
      loadTeams(token);
    } else if (moduleKey === "security-analytics" && token) {
      loadSecurityAnalytics(token);
    } else if (moduleKey === "security-alerts" && token) {
      loadSecurityAlerts(token);
    } else if (moduleKey === "audit-logs" && token) {
      loadAuditLogs(token);
    } else if (moduleKey === "password-health" && token) {
      loadSecurityAnalytics(token);
    } else if (moduleKey === "login-activity" && token) {
      loadAuditLogs(token);
    }
  };

  const refreshCurrentModule = async () => {
    if (!token) return;

    try {
      if (activeModule === "vault" && vault?.id) {
        await loadCredentials(vault.id, token);
      } else if (activeModule === "shared-resources") {
        await loadSharedCredentials(token);
      } else if (activeModule === "shared-with") {
        await loadAllCredentialShares(token, credentials);
      } else if (activeModule === "team-vault" && selectedTeam) {
        await refreshSelectedTeam();
      } else if (activeModule === "security-alerts") {
        await loadSecurityAlerts();
      } else if (activeModule === "security-analytics" || activeModule === "password-health") {
        await loadSecurityAnalytics();
      } else if (activeModule === "login-activity" || activeModule === "audit-logs") {
        await loadAuditLogs();
      }
      setMessage("View refreshed successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  const clearTeamVaultForm = () => {
    setTeamCredentialEditingId(null);
    setTeamCredentialTitle("");
    setTeamCredentialUsername("");
    setTeamCredentialPassword("");
    setTeamCredentialUrl("");
    setTeamCredentialNotes("");
    setTeamCredentialSourceId("");
    setTeamCredentialPasswordStrength(null);
    setTeamCredentialPasswordSuggestions([]);
  };

  const openAddTeamMemberModal = () => {
    setTeamMemberEmail("");
    setTeamMemberPermission("VIEW_ONLY");
    setShowAddTeamMemberModal(true);
    setTeamVaultError("");
    setTeamVaultMessage("");
  };

  const openEditTeamMemberModal = (member) => {
    setEditingTeamMember(member);
    setTeamMemberEmail(member.userEmail || "");
    setTeamMemberPermission(member.permission || "VIEW_ONLY");
    setShowEditTeamMemberModal(true);
    setTeamVaultError("");
    setTeamVaultMessage("");
  };

  const openAddTeamCredentialModal = () => {
    clearTeamVaultForm();
    setShowAddTeamCredentialModal(true);
    setTeamVaultError("");
    setTeamVaultMessage("");
  };

  const openManageTeamModal = () => {
    setShowManageTeamModal(true);
    setTeamVaultError("");
    setTeamVaultMessage("");
  };

  const closeTeamModals = () => {
    setShowAddTeamMemberModal(false);
    setShowEditTeamMemberModal(false);
    setShowAddTeamCredentialModal(false);
    setShowManageTeamModal(false);
    setEditingTeamMember(null);
    setTeamMemberEmail("");
    setTeamMemberPermission("VIEW_ONLY");
    clearTeamVaultForm();
  };

  const applyPersonalCredentialTemplate = (credentialId) => {
    setTeamCredentialSourceId(credentialId);
    if (!credentialId) return;

    const source = credentials.find((c) => String(c.id) === String(credentialId));
    if (!source) return;

    setTeamCredentialTitle(source.title || "");
    setTeamCredentialUsername(source.username || "");
    setTeamCredentialPassword(source.password || "");
    setTeamCredentialUrl(source.url || "");
    setTeamCredentialNotes(source.notes || "");
  };

  const loadTeams = async (authToken = token) => {
    if (!authToken) return;

    setTeamsLoading(true);
    setTeamsError("");

    try {
      const response = await fetch(`${API}/api/teams/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      const data = await readJsonResponse(response, "Unable to load teams");
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to load teams");
      }

      const loadedTeams = Array.isArray(data) ? data : [];
      setTeams(loadedTeams);

      if (loadedTeams.length === 0) {
        setSelectedTeamId(null);
        setSelectedTeam(null);
        setTeamMembers([]);
        setTeamCredentials([]);
        setTeamVaultId(null);
        clearTeamVaultForm();
        return;
      }

      setSelectedTeamId((currentSelectedTeamId) => {
        const stillExists = loadedTeams.some((t) => t.id === currentSelectedTeamId);
        return stillExists ? currentSelectedTeamId : loadedTeams[0].id;
      });
    } catch (err) {
      console.error("Load teams error:", err);
      setTeams([]);
      setTeamsError(err.message || "Unable to load teams");
    } finally {
      setTeamsLoading(false);
    }
  };

  const loadTeamMembers = async (teamId, authToken = token) => {
    if (!authToken || !teamId) {
      setTeamMembers([]);
      return;
    }

    setTeamMembersLoading(true);
    setTeamMembersError("");

    try {
      const response = await fetch(`${API}/api/teams/${teamId}/members`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      const data = await readJsonResponse(response, "Unable to load team members");
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to load team members");
      }

      setTeamMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load team members error:", err);
      setTeamMembers([]);
      setTeamMembersError(err.message || "Unable to load team members");
    } finally {
      setTeamMembersLoading(false);
    }
  };

  const loadTeamCredentials = async (t, authToken = token) => {
    if (!authToken || !t) {
      setTeamCredentials([]);
      setTeamVaultId(null);
      return;
    }

    setTeamCredentialsLoading(true);
    setTeamCredentialsError("");

    try {
      const currentUserIsOwner = isCurrentUserTeamOwner(t);

      if (currentUserIsOwner) {
        const teamVault = resolveTeamVault(t);

        if (!teamVault) {
          setTeamVaultId(null);
          setTeamCredentials([]);
          setTeamCredentialsError("Team vault not found in your vault list.");
          return;
        }

        setTeamVaultId(teamVault.id);

        const response = await fetch(`${API}/api/vaults/${teamVault.id}/credentials`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (handleSessionExpired(response.status)) return;

        const data = await readJsonResponse(response, "Unable to load team credentials");
        if (!response.ok) {
          throw new Error(data?.message || data?.error || "Unable to load team credentials");
        }

        const credentialsList = Array.isArray(data)
          ? data.map((credential) => ({
              ...credential,
              credentialId: credential.id,
              permission: "FULL_MANAGEMENT",
              canEdit: true,
              canDelete: true,
              canManageShares: true,
              sharedBy: t.ownerEmail,
              vaultId: teamVault.id,
            }))
          : [];

        setTeamCredentials(credentialsList);
        return;
      }

      setTeamVaultId(null);

      const response = await fetch(`${API}/api/credentials/shared-with-me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (handleSessionExpired(response.status)) return;

      const data = await readJsonResponse(response, "Unable to load team credentials");
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to load team credentials");
      }

      const filteredCredentials = Array.isArray(data)
        ? data.filter((credential) => credential.sharedBy?.toLowerCase() === t.ownerEmail?.toLowerCase())
        : [];

      setTeamCredentials(
        filteredCredentials.map((credential) => ({
          ...credential,
          id: credential.credentialId,
          canEdit: Boolean(credential.canEdit),
          canDelete: Boolean(credential.canDelete),
          canManageShares: Boolean(credential.canManageShares),
          vaultId: null,
        }))
      );
    } catch (err) {
      console.error("Load team credentials error:", err);
      setTeamCredentials([]);
      setTeamCredentialsError(err.message || "Unable to load team credentials");
    } finally {
      setTeamCredentialsLoading(false);
    }
  };

  const refreshSelectedTeam = async () => {
    if (!selectedTeamId) return;
    const t = teams.find((item) => item.id === selectedTeamId);
    if (!t) return;

    await loadTeamMembers(t.id, token);
    await loadTeamCredentials(t, token);
  };

  const createTeam = async (e) => {
    e.preventDefault();

    if (!token) {
      setTeamVaultError("Authentication token is missing.");
      return;
    }

    const nameToCreate = newTeamName.trim();
    if (!nameToCreate) {
      setTeamVaultError("Team name is required.");
      return;
    }

    setTeamVaultLoading(true);
    setTeamVaultError("");
    setTeamVaultMessage("");

    try {
      const response = await fetch(`${API}/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nameToCreate }),
      });

      if (handleSessionExpired(response.status)) {
        setTeamVaultLoading(false);
        return;
      }

      const data = await readJsonResponse(response, "Unable to create team");
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to create team");
      }

      setNewTeamName("");
      setTeamVaultMessage("Team created successfully.");
      await loadTeams(token);

      if (data?.id) {
        setSelectedTeamId(data.id);
      }
    } catch (err) {
      console.error("Create team error:", err);
      setTeamVaultError(err.message || "Unable to create team");
    } finally {
      setTeamVaultLoading(false);
    }
  };

  const addTeamMember = async (e) => {
    e.preventDefault();

    if (!token || !selectedTeamId) {
      setTeamVaultError("Select a team first.");
      return;
    }

    const emailToAdd = teamMemberEmail.trim();
    if (!emailToAdd) {
      setTeamVaultError("Member email is required.");
      return;
    }

    setTeamVaultLoading(true);
    setTeamVaultError("");
    setTeamVaultMessage("");

    try {
      const response = await fetch(`${API}/api/teams/${selectedTeamId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userEmail: emailToAdd,
          permission: teamMemberPermission,
        }),
      });

      if (handleSessionExpired(response.status)) {
        setTeamVaultLoading(false);
        return;
      }

      const data = await readJsonResponse(response, "Unable to add team member");
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to add team member");
      }

      setTeamMemberEmail("");
      setTeamMemberPermission("VIEW_ONLY");
      setTeamVaultMessage("Team member added successfully.");
      closeTeamModals();
      await refreshSelectedTeam();
      await loadTeams(token);
    } catch (err) {
      console.error("Add team member error:", err);
      setTeamVaultError(err.message || "Unable to add team member");
    } finally {
      setTeamVaultLoading(false);
    }
  };

  const saveTeamMemberAccess = async (e) => {
    e.preventDefault();

    if (!editingTeamMember) {
      setTeamVaultError("Select a team member first.");
      return;
    }

    const currentPerm = String(editingTeamMember.permission || "VIEW_ONLY").toUpperCase();
    const nextPerm = String(teamMemberPermission || "VIEW_ONLY").toUpperCase();

    if (currentPerm === nextPerm) {
      closeTeamModals();
      return;
    }

    setTeamVaultLoading(true);
    setTeamVaultError("");
    setTeamVaultMessage("");

    try {
      const removeResponse = await fetch(`${API}/api/teams/${selectedTeamId}/members/${editingTeamMember.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (handleSessionExpired(removeResponse.status)) {
        setTeamVaultLoading(false);
        return;
      }

      const addResponse = await fetch(`${API}/api/teams/${selectedTeamId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userEmail: editingTeamMember.userEmail,
          permission: nextPerm,
        }),
      });

      if (handleSessionExpired(addResponse.status)) {
        setTeamVaultLoading(false);
        return;
      }

      const addData = await readJsonResponse(addResponse, "Unable to update member access");
      if (!addResponse.ok) {
        throw new Error(addData?.message || addData?.error || "Unable to update member access");
      }

      setTeamVaultMessage("Team member access updated successfully.");
      closeTeamModals();
      await refreshSelectedTeam();
    } catch (err) {
      console.error("Save team member access error:", err);
      setTeamVaultError(err.message || "Unable to update member access");
    } finally {
      setTeamVaultLoading(false);
    }
  };

  const removeTeamMember = async (memberId) => {
    if (!token || !selectedTeamId) return;
    if (!window.confirm("Remove this team member?")) return;

    setTeamVaultLoading(true);
    setTeamVaultError("");
    setTeamVaultMessage("");

    try {
      const response = await fetch(`${API}/api/teams/${selectedTeamId}/members/${memberId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) {
        setTeamVaultLoading(false);
        return;
      }

      const data = await readJsonResponse(response, "Unable to remove team member");
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to remove team member");
      }

      setTeamVaultMessage("Team member removed successfully.");
      await refreshSelectedTeam();
      await loadTeams(token);
    } catch (err) {
      console.error("Remove team member error:", err);
      setTeamVaultError(err.message || "Unable to remove team member");
    } finally {
      setTeamVaultLoading(false);
    }
  };

  const saveTeamCredential = async (e) => {
    e.preventDefault();

    if (!token || !selectedTeam) {
      setTeamCredentialsError("Select a team first.");
      return;
    }

    const currentPermission = getCurrentTeamPermission(selectedTeam);
    const canWrite = currentPermission === "EDIT" || currentPermission === "FULL_MANAGEMENT";

    if (!canWrite && !isCurrentUserTeamOwner(selectedTeam)) {
      setTeamCredentialsError("You do not have permission to manage this team vault.");
      return;
    }

    const resolvedVault = teamVaultId || resolveTeamVault(selectedTeam)?.id;
    if (!resolvedVault) {
      setTeamCredentialsError("Team vault is not available in your vault list.");
      return;
    }

    setTeamVaultLoading(true);
    setTeamCredentialsError("");
    setTeamVaultMessage("");

    const requestBody = {
      title: teamCredentialTitle.trim(),
      username: teamCredentialUsername.trim(),
      password: teamCredentialPassword,
      url: teamCredentialUrl.trim(),
      notes: teamCredentialNotes.trim(),
    };

    try {
      const response = await fetch(
        teamCredentialEditingId
          ? `${API}/api/vaults/${resolvedVault}/credentials/${teamCredentialEditingId}`
          : `${API}/api/vaults/${resolvedVault}/credentials`,
        {
          method: teamCredentialEditingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (handleSessionExpired(response.status)) {
        setTeamVaultLoading(false);
        return;
      }

      const data = await readJsonResponse(response, "Unable to save team credential");
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Unable to save team credential");
      }

      setTeamVaultMessage(
        teamCredentialEditingId
          ? "Team credential updated successfully."
          : "Team credential created successfully."
      );
      clearTeamVaultForm();
      closeTeamModals();
      await loadTeamCredentials(selectedTeam, token);
      await loadSecurityAnalytics(token);
    } catch (err) {
      console.error("Save team credential error:", err);
      setTeamCredentialsError(err.message || "Unable to save team credential");
    } finally {
      setTeamVaultLoading(false);
    }
  };

  const editTeamCredential = (cred) => {
    setTeamCredentialEditingId(cred.id || cred.credentialId);
    setTeamCredentialTitle(cred.title || "");
    setTeamCredentialUsername(cred.username || "");
    setTeamCredentialPassword(cred.password || "");
    setTeamCredentialUrl(cred.url || "");
    setTeamCredentialNotes(cred.notes || "");
    setTeamVaultMessage("");
    setTeamCredentialsError("");
    setShowAddTeamCredentialModal(true);
    if (cred.password) {
      checkTeamCredentialPasswordStrength(cred.password);
    }
  };

  const deleteTeamCredential = async (cred) => {
    if (!token || !selectedTeam) return;

    const currentPermission = getCurrentTeamPermission(selectedTeam);
    const canDel = currentPermission === "FULL_MANAGEMENT" || isCurrentUserTeamOwner(selectedTeam);

    if (!canDel) {
      setTeamCredentialsError("You do not have permission to delete this team credential.");
      return;
    }

    if (teamCredentials.length <= 1) {
      setTeamCredentialsError("A team must retain at least one credential.");
      return;
    }

    const resolvedVault = teamVaultId || resolveTeamVault(selectedTeam)?.id;
    if (!resolvedVault) return;

    if (!window.confirm("Delete this team credential?")) return;

    setTeamVaultLoading(true);

    try {
      const response = await fetch(
        `${API}/api/vaults/${resolvedVault}/credentials/${cred.id || cred.credentialId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (handleSessionExpired(response.status)) {
        setTeamVaultLoading(false);
        return;
      }

      setTeamVaultMessage("Team credential deleted successfully.");
      await loadTeamCredentials(selectedTeam, token);
      await loadSecurityAnalytics(token);
    } catch (err) {
      console.error("Delete team credential error:", err);
      setTeamCredentialsError(err.message || "Unable to delete team credential");
    } finally {
      setTeamVaultLoading(false);
    }
  };

  const formatAnalyticsTimestamp = (val) => {
    if (!val) return "-";
    const date = new Date(val);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
  };

  const loadSecurityAnalytics = async (authToken = token) => {
    if (!authToken) return;

    setSecurityAnalyticsLoading(true);
    setSecurityAnalyticsError("");

    try {
      const response = await fetch(`${API}/api/analytics/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (handleSessionExpired(response.status)) {
        setSecurityAnalyticsLoading(false);
        return;
      }

      const responseBody = await response.text();
      let data = null;
      if (responseBody.trim()) {
        try {
          data = JSON.parse(responseBody);
        } catch {
          throw new Error("Unable to load security analytics.");
        }
      }

      if (!response.ok || !data) {
        setSecurityAnalytics(null);
        return;
      }

      setSecurityAnalytics({
        totalCredentials: Number(data.totalCredentials) || 0,
        totalVaults: Number(data.totalVaults) || 0,
        activeAlerts: Number(data.activeAlerts) || 0,
        resolvedAlerts: Number(data.resolvedAlerts) || 0,
        passwordHealthScore: Number(data.passwordHealthScore) || 0,
        strongPasswords: Number(data.strongPasswords) || 0,
        mediumPasswords: Number(data.mediumPasswords) || 0,
        weakPasswords: Number(data.weakPasswords) || 0,
        successfulLogins: Number(data.successfulLogins) || 0,
        failedLogins: Number(data.failedLogins) || 0,
        recentActivity: Array.isArray(data.recentActivity) ? data.recentActivity : [],
      });
    } catch (err) {
      console.error("Security analytics error:", err);
      setSecurityAnalytics(null);
      setSecurityAnalyticsError("Unable to load security analytics.");
    } finally {
      setSecurityAnalyticsLoading(false);
    }
  };

  const resolveSecurityAlert = async (alertId) => {
    if (!token) return;

    try {
      const response = await fetch(`${API}/api/security-alerts/${alertId}/resolve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) return;
      if (!response.ok) throw new Error("Unable to resolve security alert.");

      setMessage("Security alert resolved.");
      await loadSecurityAlerts();
      await loadSecurityAnalytics();
    } catch (err) {
      console.error("Resolve security alert error:", err);
      setError("Unable to resolve security alert.");
    }
  };

  const downloadLoginHistory = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API}/api/audit-logs/my/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (handleSessionExpired(response.status)) return;
      if (!response.ok) throw new Error("Unable to download audit logs");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `login-history-${new Date().getTime()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setMessage("Login history downloaded successfully");
    } catch (err) {
      console.error("Download audit logs error:", err);
      setError(err.message || "Failed to download login history");
    }
  };

  const downloadPasswordHealthReport = () => {
    if (!securityAnalytics) {
      setError("No password health data available.");
      return;
    }

    try {
      const reportData = [
        ["Password Health Report"],
        [`Generated: ${new Date().toLocaleString()}`],
        [],
        ["Overall Health Score", `${securityAnalytics.passwordHealthScore}%`],
        [],
        ["Password Strength Distribution"],
        ["Strength", "Count"],
        ["Strong", securityAnalytics.strongPasswords],
        ["Medium", securityAnalytics.mediumPasswords],
        ["Weak", securityAnalytics.weakPasswords],
        [],
        ["Recommendations"],
        ["Total Credentials", securityAnalytics.totalCredentials],
        ["Weak Credentials to Update", securityAnalytics.weakPasswords],
      ];

      const csv = reportData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `password-health-report-${new Date().getTime()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setMessage("Password health report downloaded successfully");
    } catch (err) {
      console.error("Download report error:", err);
      setError(err.message || "Failed to download password health report");
    }
  };

  const downloadLoginActivityReport = () => {
    if (!auditLogs || auditLogs.length === 0) {
      setError("No login activity data available.");
      return;
    }

    try {
      const reportData = [
        ["Login Activity Report"],
        [`Generated: ${new Date().toLocaleString()}`],
        [],
        ["Date/Time", "Action", "Status", "Description", "IP Address"],
        ...auditLogs.map((log) => [
          new Date(log.timestamp).toLocaleString(),
          formatActionLabel(log.action),
          log.status,
          log.description,
          log.ipAddress || "-",
        ]),
      ];

      const csv = reportData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `login-activity-report-${new Date().getTime()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setMessage("Login activity report downloaded successfully");
    } catch (err) {
      console.error("Download report error:", err);
      setError(err.message || "Failed to download login activity report");
    }
  };

  // Helper toggle for password mask
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy to clipboard helper
  const copyText = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setMessage(`${label} copied to clipboard!`);
    setTimeout(() => setMessage(""), 3000);
  };

  // ---------------- LOGOUT ----------------

  const logout = () => {
    localStorage.removeItem("securevault_token");
    localStorage.removeItem("securevault_user");

    setToken(null);
    setUser(null);
    setVault(null);
    setCredentials([]);
    setTeams([]);
    setSelectedTeam(null);
    setSelectedTeamId(null);
    setTeamMembers([]);
    setTeamCredentials([]);
    setSecurityAnalytics(null);
    setActiveModule("vault");

    clearForm();
    setError("");
    setMessage("");
    setPage("login");
  };

  // Filter credentials list for Your Vault
  const filteredCredentials = credentials.filter((cred) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (cred.title && cred.title.toLowerCase().includes(q)) ||
      (cred.username && cred.username.toLowerCase().includes(q)) ||
      (cred.url && cred.url.toLowerCase().includes(q))
    );
  });

  // Selected Team Permission & Controls
  const selectedTeamPermission = getCurrentTeamPermission(selectedTeam);
  const selectedTeamIsOwner = isCurrentUserTeamOwner(selectedTeam);
  const canManageSelectedTeamMembers = selectedTeamIsOwner || selectedTeamPermission === "FULL_MANAGEMENT";
  const canWriteSelectedTeamCredentials = selectedTeamIsOwner || selectedTeamPermission === "EDIT" || selectedTeamPermission === "FULL_MANAGEMENT";
  const canDeleteSelectedTeamCredentials = selectedTeamIsOwner || selectedTeamPermission === "FULL_MANAGEMENT";

  // ---------------- LOGIN PAGE ----------------

  if (page === "login") {
    return (
      <div className="auth-wrapper">
        <div className="auth-card-panel">
          <div className="auth-header">
            <div className="auth-logo">
              <ShieldIcon />
            </div>
            <h1 className="auth-title">SecureVault</h1>
            <p className="auth-subtitle">Professional Password Manager</p>
          </div>

          <form onSubmit={login}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }} disabled={loading}>
              {loading ? "Authenticating..." : "Sign In to Vault"}
            </button>
          </form>

          {error && <div className="alert-banner alert-banner-error" style={{ marginTop: "16px" }}>{error}</div>}
          {message && <div className="alert-banner alert-banner-success" style={{ marginTop: "16px" }}>{message}</div>}

          <div className="auth-switch">
            Don't have an account?{" "}
            <button
              className="link-btn"
              onClick={() => {
                setPage("register");
                setError("");
                setMessage("");
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- REGISTER PAGE ----------------

  if (page === "register") {
    return (
      <div className="auth-wrapper">
        <div className="auth-card-panel">
          <div className="auth-header">
            <div className="auth-logo">
              <ShieldIcon />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join SecureVault Today</p>
          </div>

          <form onSubmit={register}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Master Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }} disabled={loading}>
              {loading ? "Creating Account..." : "Register Account"}
            </button>
          </form>

          {error && <div className="alert-banner alert-banner-error" style={{ marginTop: "16px" }}>{error}</div>}
          {message && <div className="alert-banner alert-banner-success" style={{ marginTop: "16px" }}>{message}</div>}

          <div className="auth-switch">
            Already have an account?{" "}
            <button
              className="link-btn"
              onClick={() => {
                setPage("login");
                setError("");
                setMessage("");
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN DASHBOARD LAYOUT ----------------

  const pageHeadings = {
    "vault": { title: "Your Vault", subtitle: "Manage and secure your personal credentials and passwords." },
    "shared-resources": { title: "Shared Resources", subtitle: "Access credentials that have been shared with you by team members." },
    "shared-with": { title: "Shared With", subtitle: "Monitor and manage credentials you have shared with other users." },
    "team-vault": { title: "Team Vault", subtitle: "Collaborate securely in team workspaces and shared vaults." },
    "security-analytics": { title: "Security Analytics", subtitle: "Real-time overview of security scores and password metrics." },
    "security-alerts": { title: "Security Alerts", subtitle: "Review security notifications, warnings, and active alerts." },
    "audit-logs": { title: "Audit Logs", subtitle: "Comprehensive event log of all vault operations and logins." },
    "password-health": { title: "Password Health", subtitle: "Detailed diagnosis of password strength and recommendations." },
    "login-activity": { title: "Login Activity", subtitle: "Track successful and failed login attempts for account security." },
  };

  const currentHeading = pageHeadings[activeModule] || { title: "SecureVault", subtitle: "Password Manager" };

  return (
    <div className="app-shell">
      {/* LEFT SIDEBAR - VISUALLY FIXED, FULL HEIGHT */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-row">
            <div className="brand-icon-wrapper">
              <ShieldIcon />
            </div>
            <span className="brand-title">SecureVault</span>
          </div>

          <div className="sidebar-user-badge">
            <div className="user-avatar">
              <UserIcon />
            </div>
            <div className="user-details">
              <span className="user-name-label">{user?.fullName || user?.email || "Logged User"}</span>
              <span className="user-role-label">{user?.email || "Personal Account"}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${activeModule === "vault" ? "active" : ""}`}
            onClick={() => openModule("vault")}
          >
            <VaultIcon /> <span>Your Vault</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeModule === "shared-resources" ? "active" : ""}`}
            onClick={() => openModule("shared-resources")}
          >
            <SharedResourcesIcon /> <span>Shared Resources</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeModule === "shared-with" ? "active" : ""}`}
            onClick={() => openModule("shared-with")}
          >
            <SharedWithIcon /> <span>Shared With</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeModule === "team-vault" ? "active" : ""}`}
            onClick={() => openModule("team-vault")}
          >
            <TeamVaultIcon /> <span>Team Vault</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeModule === "security-analytics" ? "active" : ""}`}
            onClick={() => openModule("security-analytics")}
          >
            <AnalyticsIcon /> <span>Security Analytics</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeModule === "security-alerts" ? "active" : ""}`}
            onClick={() => openModule("security-alerts")}
          >
            <AlertsIcon /> <span>Security Alerts</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeModule === "audit-logs" ? "active" : ""}`}
            onClick={() => openModule("audit-logs")}
          >
            <AuditLogsIcon /> <span>Audit Logs</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeModule === "password-health" ? "active" : ""}`}
            onClick={() => openModule("password-health")}
          >
            <PasswordHealthIcon /> <span>Password Health</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeModule === "login-activity" ? "active" : ""}`}
            onClick={() => openModule("login-activity")}
          >
            <LoginActivityIcon /> <span>Login Activity</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="nav-item logout-nav-item" onClick={logout}>
            <LogoutIcon /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="content-header">
          <div>
            <h1 className="page-title">{currentHeading.title}</h1>
            <p className="page-subtitle">{currentHeading.subtitle}</p>
          </div>

          <button type="button" className="btn btn-secondary btn-sm" onClick={refreshCurrentModule}>
            <RefreshIcon /> Refresh
          </button>
        </header>

        {message && (
          <div className="alert-banner alert-banner-success">
            <span>{message}</span>
            <button className="alert-close" onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {error && (
          <div className="alert-banner alert-banner-error">
            <span>{error}</span>
            <button className="alert-close" onClick={() => setError("")}>×</button>
          </div>
        )}

        <div className="module-container">
          {/* ==================== 1. YOUR VAULT ==================== */}
          {activeModule === "vault" && (
            <div className="vault-page-grid">
              {/* LEFT COLUMN: Your Credentials */}
              <div className="panel-card">
                <div className="panel-header">
                  <h2 className="panel-title">Your Credentials</h2>
                  <span className="badge-count">{credentials.length} stored</span>
                </div>

                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search credentials by title or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {filteredCredentials.length === 0 ? (
                  <div className="empty-state">
                    <p>No credentials found.</p>
                    <span style={{ fontSize: "13px" }}>Use the Create Credential form on the right to add your first password.</span>
                  </div>
                ) : (
                  <div className="credential-list">
                    {filteredCredentials.map((cred) => {
                      const isPwdVisible = visiblePasswords[cred.id];
                      return (
                        <div className="credential-card" key={cred.id}>
                          <div className="credential-card-header">
                            <div className="credential-title-group">
                              <div className="credential-title-icon">
                                {(cred.title || "C").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="credential-title">{cred.title}</h3>
                                {cred.url && (
                                  <a href={cred.url.startsWith("http") ? cred.url : `https://${cred.url}`} target="_blank" rel="noopener noreferrer" className="credential-url-link">
                                    {cred.url.replace(/^https?:\/\//, "")} <ExternalLinkIcon />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="credential-details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Username</span>
                              <div className="detail-value-row">
                                <span className="detail-value">{cred.username}</span>
                                <button type="button" className="btn-inline-action" title="Copy Username" onClick={() => copyText(cred.username, "Username")}>
                                  <CopyIcon />
                                </button>
                              </div>
                            </div>

                            <div className="detail-item">
                              <span className="detail-label">Password</span>
                              <div className="detail-value-row">
                                <span className="detail-value">
                                  {isPwdVisible ? cred.password : "••••••••••••"}
                                </span>
                                <button
                                  type="button"
                                  className="btn-inline-action"
                                  title={isPwdVisible ? "Hide Password" : "Show Password"}
                                  onClick={() => togglePasswordVisibility(cred.id)}
                                >
                                  {isPwdVisible ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                                <button type="button" className="btn-inline-action" title="Copy Password" onClick={() => copyText(cred.password, "Password")}>
                                  <CopyIcon />
                                </button>
                              </div>
                            </div>
                          </div>

                          {cred.notes && (
                            <div className="credential-notes">
                              <strong>Notes:</strong> {cred.notes}
                            </div>
                          )}

                          <div className="credential-card-actions">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => editCredential(cred)}>
                              Edit
                            </button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => openShareModal(cred.id)}>
                              Share
                            </button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteCredential(cred.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Create Credential Form */}
              <div className="panel-card">
                <div className="panel-header">
                  <h2 className="panel-title">{editingId ? "Edit Credential" : "Create Credential"}</h2>
                </div>

                <form onSubmit={saveCredential}>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. GitHub Account"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username / Email</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="user@example.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-with-button">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter or generate password"
                        value={credentialPassword}
                        onChange={async (e) => {
                          setCredentialPassword(e.target.value);
                          await checkPasswordStrength(e.target.value);
                        }}
                        required
                      />
                      <button type="button" className="btn btn-secondary" onClick={generatePassword}>
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* Password Generator Options */}
                  <details className="generator-accordion">
                    <summary className="generator-summary">Password Generator Options</summary>
                    <div className="generator-controls-grid">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Length ({genLength})</label>
                        <input
                          type="number"
                          className="form-input"
                          value={genLength}
                          onChange={(e) => setGenLength(parseInt(e.target.value) || 16)}
                          min="8"
                          max="128"
                        />
                      </div>

                      <label className="checkbox-label" style={{ marginTop: "24px" }}>
                        <input
                          type="checkbox"
                          checked={genUppercase}
                          onChange={(e) => setGenUppercase(e.target.checked)}
                        />
                        Uppercase (A-Z)
                      </label>

                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={genLowercase}
                          onChange={(e) => setGenLowercase(e.target.checked)}
                        />
                        Lowercase (a-z)
                      </label>

                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={genNumbers}
                          onChange={(e) => setGenNumbers(e.target.checked)}
                        />
                        Numbers (0-9)
                      </label>

                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={genSpecial}
                          onChange={(e) => setGenSpecial(e.target.checked)}
                        />
                        Symbols (!@#$)
                      </label>
                    </div>
                  </details>

                  {/* Password Strength Meter */}
                  {credentialPassword && (
                    <div className="strength-meter-container">
                      <div className="strength-label-row">
                        <span>Password Strength:</span>
                        <span className={`strength-badge strength-${passwordStrength || "unknown"}`}>
                          {checkingStrength ? "Checking..." : passwordStrength || "Unknown"}
                        </span>
                      </div>
                      {passwordSuggestions.length > 0 && (
                        <ul className="suggestions-list">
                          {passwordSuggestions.map((sug, idx) => (
                            <li key={idx}>{sug}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Website URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Additional notes or security questions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                      {loading ? "Saving..." : editingId ? "Update Credential" : "Add Credential"}
                    </button>
                    {editingId && (
                      <button type="button" className="btn btn-secondary" onClick={clearForm}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ==================== 2. SHARED RESOURCES ==================== */}
          {activeModule === "shared-resources" && (
            <div className="panel-card">
              <div className="panel-header">
                <h2 className="panel-title">Shared Resources</h2>
                <span className="badge-count">{sharedCredentials.length} items</span>
              </div>

              {sharedCredentials.length === 0 ? (
                <div className="empty-state">
                  <p>No credentials have been shared with you yet.</p>
                </div>
              ) : (
                <div className="credential-list">
                  {sharedCredentials.map((cred) => {
                    const isPwdVisible = visiblePasswords[cred.shareId];
                    return (
                      <div className="credential-card" key={cred.shareId}>
                        <div className="credential-card-header">
                          <div className="credential-title-group">
                            <div className="credential-title-icon">
                              {(cred.title || "S").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="credential-title">{cred.title}</h3>
                              <span className={`status-tag status-${String(cred.permission).toLowerCase()}`}>
                                {cred.permission}
                              </span>
                            </div>
                          </div>
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                            Shared by: <strong>{cred.sharedBy}</strong>
                          </span>
                        </div>

                        <div className="credential-details-grid">
                          <div className="detail-item">
                            <span className="detail-label">Username</span>
                            <div className="detail-value-row">
                              <span className="detail-value">{cred.username}</span>
                              <button type="button" className="btn-inline-action" onClick={() => copyText(cred.username, "Username")}>
                                <CopyIcon />
                              </button>
                            </div>
                          </div>

                          <div className="detail-item">
                            <span className="detail-label">Expires At</span>
                            <div className="detail-value-row">
                              <span className="detail-value">{cred.expiresAt || "No Expiry"}</span>
                            </div>
                          </div>
                        </div>

                        {cred.url && <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}><strong>URL:</strong> {cred.url}</p>}
                        {cred.notes && <div className="credential-notes"><strong>Notes:</strong> {cred.notes}</div>}

                        <div className="credential-card-actions">
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => viewSharedCredential(cred.credentialId)}>
                            View Details
                          </button>

                          {(cred.permission === "EDIT" || cred.permission === "FULL_MANAGEMENT") && (
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => editCredential(cred)}>
                              Edit
                            </button>
                          )}

                          {cred.permission === "FULL_MANAGEMENT" && (
                            <>
                              <button type="button" className="btn btn-secondary btn-sm" onClick={() => openManageShares(cred)}>
                                Manage Access
                              </button>
                              <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteCredential(cred.credentialId, cred.vaultId)}>
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== 3. SHARED WITH ==================== */}
          {activeModule === "shared-with" && (
            <div className="panel-card">
              <div className="panel-header">
                <h2 className="panel-title">Shared With Others</h2>
                <span className="badge-count">{allCredentialShares.length} active shares</span>
              </div>

              {allCredentialShares.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't shared any credentials from your vault yet.</p>
                </div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Credential</th>
                        <th>Shared To</th>
                        <th>Permission</th>
                        <th>Expires</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allCredentialShares.map((share) => {
                        const isExpired = share.expired === true || share.status === "Expired";
                        return (
                          <tr key={`${share.credentialId}-${share.id}`}>
                            <td><strong>{share.credentialTitle}</strong></td>
                            <td>{share.sharedWithUserEmail}</td>
                            <td>
                              <span className={`status-tag status-${String(share.permission).toLowerCase()}`}>
                                {share.permission}
                              </span>
                            </td>
                            <td>{share.expiresAt ? new Date(share.expiresAt).toLocaleString() : "Never"}</td>
                            <td>
                              <span className={`status-tag ${isExpired ? "status-failed" : "status-success"}`}>
                                {isExpired ? "Expired" : "Active"}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                {!isExpired && (
                                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEditSharedWithModal(share)}>
                                    Edit
                                  </button>
                                )}
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSharedWithShare(share)}>
                                  Revoke
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==================== 4. TEAM VAULT ==================== */}
          {activeModule === "team-vault" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Create Team Card */}
              <div className="panel-card">
                <div className="panel-header">
                  <h2 className="panel-title">Create Team Workspace</h2>
                </div>
                <form onSubmit={createTeam} style={{ display: "flex", gap: "12px" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter new team name..."
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    required
                    style={{ maxWidth: "360px" }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={teamVaultLoading}>
                    {teamVaultLoading ? "Creating..." : "Create Team"}
                  </button>
                </form>
              </div>

              {/* Teams & Selected Team Dashboard */}
              <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", alignItems: "start" }}>
                {/* Teams List */}
                <div className="panel-card">
                  <div className="panel-header">
                    <h2 className="panel-title">Your Teams</h2>
                  </div>

                  {teamsLoading ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading teams...</p>
                  ) : teams.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No teams found.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {teams.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`btn ${selectedTeamId === t.id ? "btn-primary" : "btn-secondary"}`}
                          style={{ justifyContent: "flex-start", width: "100%", textAlign: "left" }}
                          onClick={() => setSelectedTeamId(t.id)}
                        >
                          <div>
                            <strong>{t.name}</strong>
                            <div style={{ fontSize: "11px", opacity: 0.8 }}>Owner: {t.ownerEmail}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Team Dashboard */}
                <div className="panel-card">
                  {!selectedTeam ? (
                    <div className="empty-state">
                      <p>Select a team from the list to view members and credentials.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="panel-header">
                        <div>
                          <h2 className="panel-title">{selectedTeam.name}</h2>
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                            Owner: {selectedTeam.ownerEmail} | Your Access: <strong>{formatTeamPermission(selectedTeamPermission)}</strong>
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={openAddTeamMemberModal} disabled={!canManageSelectedTeamMembers}>
                            + Member
                          </button>
                          <button type="button" className="btn btn-primary btn-sm" onClick={openAddTeamCredentialModal} disabled={!canWriteSelectedTeamCredentials}>
                            + Credential
                          </button>
                        </div>
                      </div>

                      {teamVaultMessage && <div className="alert-banner alert-banner-success" style={{ marginBottom: "16px" }}>{teamVaultMessage}</div>}
                      {teamVaultError && <div className="alert-banner alert-banner-error" style={{ marginBottom: "16px" }}>{teamVaultError}</div>}

                      {/* Team Members Section */}
                      <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>Team Members</h3>
                      {teamMembersLoading ? (
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Loading members...</p>
                      ) : teamMembers.length === 0 ? (
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No members added to team.</p>
                      ) : (
                        <div className="data-table-wrapper" style={{ marginBottom: "24px" }}>
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>Member</th>
                                <th>Email</th>
                                <th>Permission</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {teamMembers.map((m) => {
                                const isOwnerMember = m.userEmail?.toLowerCase() === selectedTeam.ownerEmail?.toLowerCase();
                                return (
                                  <tr key={m.id}>
                                    <td><strong>{m.userFullName || m.userEmail}</strong></td>
                                    <td>{m.userEmail}</td>
                                    <td>
                                      <span className={`status-tag status-${String(m.permission || "VIEW_ONLY").toLowerCase()}`}>
                                        {formatTeamPermission(m.permission)}
                                      </span>
                                    </td>
                                    <td>
                                      {canManageSelectedTeamMembers && !isOwnerMember ? (
                                        <div style={{ display: "flex", gap: "6px" }}>
                                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEditTeamMemberModal(m)}>
                                            Edit Access
                                          </button>
                                          <button type="button" className="btn btn-danger btn-sm" onClick={() => removeTeamMember(m.id)}>
                                            Remove
                                          </button>
                                        </div>
                                      ) : (
                                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Owner / Locked</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Team Credentials Section */}
                      <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>Team Credentials</h3>
                      {teamCredentialsLoading ? (
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Loading team credentials...</p>
                      ) : teamCredentials.length === 0 ? (
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No team credentials stored.</p>
                      ) : (
                        <div className="credential-list">
                          {teamCredentials.map((cred) => {
                            const isPwdVisible = visiblePasswords[cred.id || cred.credentialId];
                            const credPerm = cred.permission || (selectedTeamIsOwner ? "FULL_MANAGEMENT" : null);
                            const canEditCred = selectedTeamIsOwner || credPerm === "EDIT" || credPerm === "FULL_MANAGEMENT";
                            const canDelCred = selectedTeamIsOwner || credPerm === "FULL_MANAGEMENT";

                            return (
                              <div className="credential-card" key={cred.id || cred.credentialId}>
                                <div className="credential-card-header">
                                  <div>
                                    <h4 className="credential-title">{cred.title}</h4>
                                    <span className="detail-value">{cred.username}</span>
                                  </div>
                                  {credPerm && (
                                    <span className={`status-tag status-${String(credPerm).toLowerCase()}`}>
                                      {formatTeamPermission(credPerm)}
                                    </span>
                                  )}
                                </div>

                                <div className="credential-details-grid">
                                  <div className="detail-item">
                                    <span className="detail-label">Password</span>
                                    <div className="detail-value-row">
                                      <span className="detail-value">{isPwdVisible ? cred.password : "••••••••••••"}</span>
                                      <button type="button" className="btn-inline-action" onClick={() => togglePasswordVisibility(cred.id || cred.credentialId)}>
                                        {isPwdVisible ? <EyeOffIcon /> : <EyeIcon />}
                                      </button>
                                      <button type="button" className="btn-inline-action" onClick={() => copyText(cred.password, "Password")}>
                                        <CopyIcon />
                                      </button>
                                    </div>
                                  </div>

                                  {cred.url && (
                                    <div className="detail-item">
                                      <span className="detail-label">Website</span>
                                      <span className="detail-value">{cred.url}</span>
                                    </div>
                                  )}
                                </div>

                                {cred.notes && <div className="credential-notes"><strong>Notes:</strong> {cred.notes}</div>}

                                <div className="credential-card-actions">
                                  {canEditCred && (
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => editTeamCredential(cred)}>
                                      Edit
                                    </button>
                                  )}
                                  {canDelCred && (
                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteTeamCredential(cred)}>
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 5. SECURITY ANALYTICS ==================== */}
          {activeModule === "security-analytics" && (
            <div>
              {securityAnalyticsLoading ? (
                <div className="panel-card"><p>Loading security analytics...</p></div>
              ) : !securityAnalytics ? (
                <div className="panel-card"><p>No security analytics data available.</p></div>
              ) : (
                <>
                  <div className="analytics-stats-grid">
                    <div className="stat-card">
                      <span className="stat-card-label">Total Credentials</span>
                      <span className="stat-card-value">{securityAnalytics.totalCredentials}</span>
                      <span className="stat-card-subtext">Across all personal vaults</span>
                    </div>

                    <div className="stat-card">
                      <span className="stat-card-label">Total Vaults</span>
                      <span className="stat-card-value">{securityAnalytics.totalVaults}</span>
                      <span className="stat-card-subtext">Personal & Team vaults</span>
                    </div>

                    <div className="stat-card">
                      <span className="stat-card-label">Active Alerts</span>
                      <span className="stat-card-value" style={{ color: securityAnalytics.activeAlerts > 0 ? "var(--danger)" : "var(--success)" }}>
                        {securityAnalytics.activeAlerts}
                      </span>
                      <span className="stat-card-subtext">{securityAnalytics.resolvedAlerts} alerts resolved</span>
                    </div>

                    <div className="stat-card">
                      <span className="stat-card-label">Health Score</span>
                      <span className="stat-card-value" style={{ color: securityAnalytics.passwordHealthScore > 70 ? "var(--success)" : "var(--warning)" }}>
                        {securityAnalytics.passwordHealthScore}%
                      </span>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill progress-bar-success" style={{ width: `${securityAnalytics.passwordHealthScore}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="panel-card" style={{ marginBottom: "24px" }}>
                    <h3 className="panel-title" style={{ marginBottom: "16px" }}>Password Strength Breakdown</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                      <div style={{ padding: "16px", borderRadius: "var(--radius-md)", background: "var(--success-light)", border: "1px solid #a7f3d0" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--success-text)" }}>Strong Passwords</span>
                        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--success-text)", margin: "4px 0" }}>{securityAnalytics.strongPasswords}</h2>
                      </div>
                      <div style={{ padding: "16px", borderRadius: "var(--radius-md)", background: "var(--warning-light)", border: "1px solid #fde68a" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--warning-text)" }}>Medium Passwords</span>
                        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--warning-text)", margin: "4px 0" }}>{securityAnalytics.mediumPasswords}</h2>
                      </div>
                      <div style={{ padding: "16px", borderRadius: "var(--radius-md)", background: "var(--danger-light)", border: "1px solid #fecaca" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--danger-text)" }}>Weak Passwords</span>
                        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--danger-text)", margin: "4px 0" }}>{securityAnalytics.weakPasswords}</h2>
                      </div>
                    </div>
                  </div>

                  <div className="panel-card">
                    <h3 className="panel-title" style={{ marginBottom: "16px" }}>Recent Activity Feed</h3>
                    {securityAnalytics.recentActivity.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No recent activity recorded.</p>
                    ) : (
                      <div className="data-table-wrapper">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Action</th>
                              <th>Status</th>
                              <th>Description</th>
                              <th>Timestamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {securityAnalytics.recentActivity.map((act, idx) => (
                              <tr key={idx}>
                                <td><strong>{act.action || "-"}</strong></td>
                                <td>
                                  <span className={`status-tag ${act.status === "SUCCESS" ? "status-success" : "status-failed"}`}>
                                    {act.status || "UNKNOWN"}
                                  </span>
                                </td>
                                <td>{act.description || "-"}</td>
                                <td>{formatAnalyticsTimestamp(act.timestamp)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ==================== 6. SECURITY ALERTS ==================== */}
          {activeModule === "security-alerts" && (
            <div className="panel-card">
              <div className="panel-header">
                <h2 className="panel-title">Security Alerts</h2>
                <span className="badge-count">{securityAlerts.length} alerts</span>
              </div>

              {securityAlertsLoading ? (
                <p style={{ color: "var(--text-muted)" }}>Loading alerts...</p>
              ) : securityAlerts.length === 0 ? (
                <div className="empty-state">
                  <p>No security alerts found. Your vault is secure!</p>
                </div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Alert Type</th>
                        <th>Severity</th>
                        <th>Message</th>
                        <th>Date / Time</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityAlerts.map((alert) => {
                        const isResolved = alert.status === "RESOLVED";
                        const severity = (alert.severity || "LOW").toUpperCase();
                        return (
                          <tr key={alert.id}>
                            <td><strong>{alert.type}</strong></td>
                            <td>
                              <span className={`strength-badge strength-${severity.toLowerCase()}`}>
                                {severity}
                              </span>
                            </td>
                            <td>{alert.message}</td>
                            <td>{new Date(alert.createdAt).toLocaleString()}</td>
                            <td>
                              <span className={`status-tag ${isResolved ? "status-resolved" : "status-active"}`}>
                                {isResolved ? "RESOLVED" : "ACTIVE"}
                              </span>
                            </td>
                            <td>
                              {!isResolved ? (
                                <button type="button" className="btn btn-primary btn-sm" onClick={() => resolveSecurityAlert(alert.id)}>
                                  Resolve
                                </button>
                              ) : (
                                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Resolved</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==================== 7. AUDIT LOGS ==================== */}
          {activeModule === "audit-logs" && (
            <div className="panel-card">
              <div className="panel-header">
                <h2 className="panel-title">Audit Logs</h2>
                <button type="button" className="btn btn-secondary btn-sm" onClick={downloadLoginHistory} disabled={auditLogs.length === 0}>
                  Download Audit Report (CSV)
                </button>
              </div>

              {auditLogsLoading ? (
                <p style={{ color: "var(--text-muted)" }}>Loading audit logs...</p>
              ) : auditLogs.length === 0 ? (
                <div className="empty-state">
                  <p>No audit logs available.</p>
                </div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td>{new Date(log.timestamp).toLocaleString()}</td>
                          <td><strong>{formatActionLabel(log.action)}</strong></td>
                          <td>{log.description}</td>
                          <td>
                            <span className={`status-tag ${log.status === "SUCCESS" ? "status-success" : "status-failed"}`}>
                              {log.status}
                            </span>
                          </td>
                          <td>{log.ipAddress || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==================== 8. PASSWORD HEALTH ==================== */}
          {activeModule === "password-health" && (
            <div className="panel-card">
              <div className="panel-header">
                <h2 className="panel-title">Password Health Analysis</h2>
                <button type="button" className="btn btn-secondary btn-sm" onClick={downloadPasswordHealthReport} disabled={!securityAnalytics}>
                  Download Health Report (CSV)
                </button>
              </div>

              {!securityAnalytics ? (
                <p style={{ color: "var(--text-muted)" }}>No health data available.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "32px", padding: "24px", background: "#f8fafc", borderRadius: "var(--radius-md)" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "42px", fontWeight: 800, color: securityAnalytics.passwordHealthScore > 70 ? "var(--success)" : "var(--warning)" }}>
                        {securityAnalytics.passwordHealthScore}%
                      </div>
                      <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Overall Health Score</span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>Password Strength Distribution</h4>
                      <div className="progress-bar-bg" style={{ height: "12px", display: "flex" }}>
                        <div style={{ width: `${(securityAnalytics.strongPasswords / (securityAnalytics.totalCredentials || 1)) * 100}%`, background: "var(--success)" }} title="Strong" />
                        <div style={{ width: `${(securityAnalytics.mediumPasswords / (securityAnalytics.totalCredentials || 1)) * 100}%`, background: "var(--warning)" }} title="Medium" />
                        <div style={{ width: `${(securityAnalytics.weakPasswords / (securityAnalytics.totalCredentials || 1)) * 100}%`, background: "var(--danger)" }} title="Weak" />
                      </div>
                      <div style={{ display: "flex", gap: "20px", marginTop: "8px", fontSize: "12px" }}>
                        <span>🟢 Strong: {securityAnalytics.strongPasswords}</span>
                        <span>🟡 Medium: {securityAnalytics.mediumPasswords}</span>
                        <span>🔴 Weak: {securityAnalytics.weakPasswords}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="panel-title" style={{ marginBottom: "12px" }}>Recommendations & Security Tips</h3>
                    <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.8 }}>
                      <li>Total credentials scanned: <strong>{securityAnalytics.totalCredentials}</strong></li>
                      {securityAnalytics.weakPasswords > 0 ? (
                        <li style={{ color: "var(--danger-text)", fontWeight: 600 }}>
                          ⚠️ You have {securityAnalytics.weakPasswords} weak password(s) that should be updated immediately!
                        </li>
                      ) : (
                        <li style={{ color: "var(--success-text)" }}>✅ Great job! You have no weak passwords.</li>
                      )}
                      {securityAnalytics.mediumPasswords > 0 && (
                        <li>Consider enabling special symbols or increasing length for medium strength passwords.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 9. LOGIN ACTIVITY ==================== */}
          {activeModule === "login-activity" && (
            <div className="panel-card">
              <div className="panel-header">
                <h2 className="panel-title">Login Activity Statistics</h2>
                <button type="button" className="btn btn-secondary btn-sm" onClick={downloadLoginActivityReport} disabled={auditLogs.length === 0}>
                  Download Activity Report (CSV)
                </button>
              </div>

              <div className="analytics-stats-grid">
                <div className="stat-card">
                  <span className="stat-card-label">Successful Logins</span>
                  <span className="stat-card-value" style={{ color: "var(--success)" }}>
                    {auditLogs.filter((l) => l.action === "LOGIN_SUCCESS").length}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-card-label">Failed Logins</span>
                  <span className="stat-card-value" style={{ color: "var(--danger)" }}>
                    {auditLogs.filter((l) => l.action === "LOGIN_FAILED").length}
                  </span>
                </div>
              </div>

              <h3 className="panel-title" style={{ marginBottom: "14px" }}>Recent Login Records</h3>
              {auditLogsLoading ? (
                <p style={{ color: "var(--text-muted)" }}>Loading records...</p>
              ) : auditLogs.length === 0 ? (
                <div className="empty-state">
                  <p>No login activity recorded.</p>
                </div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date / Time</th>
                        <th>Event</th>
                        <th>Status</th>
                        <th>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.slice(0, 15).map((log) => (
                        <tr key={log.id}>
                          <td>{new Date(log.timestamp).toLocaleString()}</td>
                          <td><strong>{formatActionLabel(log.action)}</strong></td>
                          <td>
                            <span className={`status-tag ${log.status === "SUCCESS" ? "status-success" : "status-failed"}`}>
                              {log.status}
                            </span>
                          </td>
                          <td>{log.ipAddress || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ==================== MODALS ==================== */}

      {/* View Shared Credential Modal */}
      {showSharedViewModal && selectedSharedCredential && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">View Shared Credential</h3>
              <button type="button" className="btn-inline-action" onClick={() => setShowSharedViewModal(false)}>×</button>
            </div>
            <div className="form-group"><label className="form-label">Title</label><input type="text" className="form-input" value={selectedSharedCredential.title} readOnly /></div>
            <div className="form-group"><label className="form-label">Username</label><input type="text" className="form-input" value={selectedSharedCredential.username} readOnly /></div>
            <div className="form-group"><label className="form-label">Password</label><input type="text" className="form-input" value={selectedSharedCredential.password} readOnly /></div>
            {selectedSharedCredential.url && <div className="form-group"><label className="form-label">URL</label><input type="text" className="form-input" value={selectedSharedCredential.url} readOnly /></div>}
            {selectedSharedCredential.notes && <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={selectedSharedCredential.notes} readOnly /></div>}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowSharedViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Access Modal */}
      {showManageSharesModal && managedCredential && (
        <div className="modal-overlay">
          <div className="modal-card wide-modal">
            <div className="modal-header">
              <h3 className="modal-title">Manage Access - {managedCredential.title}</h3>
              <button type="button" className="btn-inline-action" onClick={() => setShowManageSharesModal(false)}>×</button>
            </div>
            {managedShares.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>This credential is not shared with anyone.</p>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Shared User</th>
                      <th>Permission</th>
                      <th>Expires</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managedShares.map((sh) => (
                      <tr key={sh.id}>
                        <td>{sh.sharedWithUserEmail}</td>
                        <td><span className="status-tag status-edit">{sh.permission}</span></td>
                        <td>{sh.expiresAt ? new Date(sh.expiresAt).toLocaleString() : "Never"}</td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => updateManagedShare(sh)}>Update</button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeManagedShare(sh)}>Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowManageSharesModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Credential Modal */}
      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Share Credential</h3>
              <button type="button" className="btn-inline-action" onClick={closeShareModal}>×</button>
            </div>
            <form onSubmit={shareCredential}>
              <div className="form-group">
                <label className="form-label">Recipient Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="recipient@example.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Permission Level</label>
                <select
                  className="form-select"
                  value={sharePermission}
                  onChange={(e) => setSharePermission(e.target.value)}
                  required
                >
                  <option value="VIEW_ONLY">VIEW_ONLY - Can view only</option>
                  <option value="EDIT">EDIT - Can view and edit</option>
                  <option value="FULL_MANAGEMENT">FULL_MANAGEMENT - Full access & delete</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Expiration Date (Optional)</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={shareExpiresAt}
                  onChange={(e) => setShareExpiresAt(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeShareModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Sharing..." : "Share"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shared With Permission Modal */}
      {showEditSharedModal && editingShare && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Edit Share Permission</h3>
              <button type="button" className="btn-inline-action" onClick={closeEditSharedWithModal}>×</button>
            </div>
            <form onSubmit={updateSharedWithShare}>
              <p style={{ fontSize: "14px", marginBottom: "12px" }}>
                Sharing <strong>{editingShare.credentialTitle}</strong> with <strong>{editingShare.sharedWithUserEmail}</strong>
              </p>

              <div className="form-group">
                <label className="form-label">Permission Level</label>
                <select
                  className="form-select"
                  value={editSharePermission}
                  onChange={(e) => setEditSharePermission(e.target.value)}
                  required
                >
                  <option value="VIEW_ONLY">VIEW_ONLY - Can view only</option>
                  <option value="EDIT">EDIT - Can view and edit</option>
                  <option value="FULL_MANAGEMENT">FULL_MANAGEMENT - Full access & delete</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditSharedWithModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Updating..." : "Update"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddTeamMemberModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Add Team Member</h3>
              <button type="button" className="btn-inline-action" onClick={closeTeamModals}>×</button>
            </div>
            <form onSubmit={addTeamMember}>
              <div className="form-group">
                <label className="form-label">Member Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="member@company.com"
                  value={teamMemberEmail}
                  onChange={(e) => setTeamMemberEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Permission Level</label>
                <select
                  className="form-select"
                  value={teamMemberPermission}
                  onChange={(e) => setTeamMemberPermission(e.target.value)}
                  required
                >
                  <option value="VIEW_ONLY">View Only - Can view credentials</option>
                  <option value="EDIT">Edit - Can view and edit credentials</option>
                  <option value="FULL_MANAGEMENT">Full Management - All permissions</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeTeamModals}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={teamVaultLoading}>{teamVaultLoading ? "Adding..." : "Add Member"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Member Access Modal */}
      {showEditTeamMemberModal && editingTeamMember && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Edit Member Access</h3>
              <button type="button" className="btn-inline-action" onClick={closeTeamModals}>×</button>
            </div>
            <form onSubmit={saveTeamMemberAccess}>
              <p style={{ fontSize: "14px", marginBottom: "12px" }}>Member: <strong>{teamMemberEmail}</strong></p>

              <div className="form-group">
                <label className="form-label">Permission Level</label>
                <select
                  className="form-select"
                  value={teamMemberPermission}
                  onChange={(e) => setTeamMemberPermission(e.target.value)}
                  required
                >
                  <option value="VIEW_ONLY">View Only - Can view credentials</option>
                  <option value="EDIT">Edit - Can view and edit credentials</option>
                  <option value="FULL_MANAGEMENT">Full Management - All permissions</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeTeamModals}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={teamVaultLoading}>{teamVaultLoading ? "Updating..." : "Update Access"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Credential Modal */}
      {showAddTeamCredentialModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">{teamCredentialEditingId ? "Edit Team Credential" : "Add Team Credential"}</h3>
              <button type="button" className="btn-inline-action" onClick={closeTeamModals}>×</button>
            </div>
            <form onSubmit={saveTeamCredential}>
              {!teamCredentialEditingId && credentials.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Use Template from Personal Vault</label>
                  <select
                    className="form-select"
                    value={teamCredentialSourceId}
                    onChange={(e) => applyPersonalCredentialTemplate(e.target.value)}
                  >
                    <option value="">-- Create from scratch --</option>
                    {credentials.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Credential title"
                  value={teamCredentialTitle}
                  onChange={(e) => setTeamCredentialTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Username"
                  value={teamCredentialUsername}
                  onChange={(e) => setTeamCredentialUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Password"
                    value={teamCredentialPassword}
                    onChange={async (e) => {
                      setTeamCredentialPassword(e.target.value);
                      await checkTeamCredentialPasswordStrength(e.target.value);
                    }}
                    required
                  />
                  <button type="button" className="btn btn-secondary" onClick={generateTeamCredentialPassword}>
                    Generate
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com"
                  value={teamCredentialUrl}
                  onChange={(e) => setTeamCredentialUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  placeholder="Additional notes"
                  value={teamCredentialNotes}
                  onChange={(e) => setTeamCredentialNotes(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeTeamModals}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={teamVaultLoading}>{teamVaultLoading ? "Saving..." : teamCredentialEditingId ? "Update" : "Save Credential"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
