# Team Vault UI Structure - Visual Guide

## Overall Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ VAULT SECTION                                                   │
│                                                                 │
│ [Collapsible] Team Vault              ┌─────────────────────┐  │
│                                        │ SUCCESS/ERROR MSGS  │  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ CREATE TEAM CARD                                            │ │
│ │                                                             │ │
│ │ Team Vault                                                  │ │
│ │ Create Team                                                 │ │
│ │ Create a team workspace and open it immediately for setup   │ │
│ │                                                             │ │
│ │ ┌──────────────────────────────────┐ ┌────────────────┐   │ │
│ │ │ Enter team name...               │ │ Create Team    │   │ │
│ │ └──────────────────────────────────┘ └────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │                     TEAM VAULT SHELL                       │  │
│ │                                                            │  │
│ │ ┌─────────────────────┐ ┌──────────────────────────────┐ │  │
│ │ │  SIDEBAR            │ │  MAIN DASHBOARD              │ │  │
│ │ │                     │ │                              │ │  │
│ │ │ My Teams            │ │  ┌──────────────────────────┐│ │  │
│ │ │ Teams you belong to │ │  │ TEAM HERO SECTION       ││ │  │
│ │ │                     │ │  │                          ││ │  │
│ │ │ ┌─────────────────┐ │ │  │ Team Name (Large)        ││ │  │
│ │ │ │ Team 1 (SEL)    │ │ │  │ Owner: owner@email.com   ││ │  │
│ │ │ │ Owner: ...      │ │ │  │ Your access: Full        ││ │  │
│ │ │ └─────────────────┘ │ │  │                          ││ │  │
│ │ │                     │ │  │ [Manage Team] [Add Mbr]  ││ │  │
│ │ │ ┌─────────────────┐ │ │  │ [Add Credential]         ││ │  │
│ │ │ │ Team 2          │ │ │  └──────────────────────────┘│ │  │
│ │ │ │ Owner: ...      │ │ │                              │ │  │
│ │ │ └─────────────────┘ │ │  ┌──────────────────────────┐│ │  │
│ │ └─────────────────────┘ │  │ MEMBERS SECTION          ││ │  │
│ │                         │  │                          ││ │  │
│ │                         │  │ Members     │+ Add Member││ │  │
│ │                         │  │ Team Members             ││ │  │
│ │                         │  │                          ││ │  │
│ │                         │  │ Member │Permission│ Actions││ │  │
│ │                         │  │ ─────────────────────────│ │  │
│ │                         │  │ alice@ │View Only   │Edit..│ │  │
│ │                         │  │ bob@   │Edit       │Edit..│ │  │
│ │                         │  │ carol@ │Full Mgmt  │     │ │  │
│ │                         │  │                    │Locked│ │  │
│ │                         │  └──────────────────────────┘│ │  │
│ │                         │                              │ │  │
│ │                         │  ┌──────────────────────────┐│ │  │
│ │                         │  │ CREDENTIALS SECTION      ││ │  │
│ │                         │  │                          ││ │  │
│ │                         │  │ Credentials │+Add Cred   ││ │  │
│ │                         │  │ Team Credentials         ││ │  │
│ │                         │  │                          ││ │  │
│ │                         │  │ ⚠️ Do not expose...       ││ │  │
│ │                         │  │                          ││ │  │
│ │                         │  │ ┌──────────────────────┐ ││ │  │
│ │                         │  │ │ GitHub Account       │ ││ │  │
│ │                         │  │ │ user@github.com      │ ││ │  │
│ │                         │  │ │ [Full Management]    │ ││ │  │
│ │                         │  │ │                      │ ││ │  │
│ │                         │  │ │ URL: github.com      │ ││ │  │
│ │                         │  │ │                      │ ││ │  │
│ │                         │  │ │ [Edit] [Delete]      │ ││ │  │
│ │                         │  │ └──────────────────────┘ ││ │  │
│ │                         │  │                          ││ │  │
│ │                         │  │ ┌──────────────────────┐ ││ │  │
│ │                         │  │ │ Gmail Account        │ ││ │  │
│ │                         │  │ │ user@gmail.com       │ ││ │  │
│ │                         │  │ │ [View Only]          │ ││ │  │
│ │                         │  │ │                      │ ││ │  │
│ │                         │  │ │ URL: gmail.com       │ ││ │  │
│ │                         │  │ │                      │ ││ │  │
│ │                         │  │ │ [Keep One]           │ ││ │  │
│ │                         │  │ └──────────────────────┘ ││ │  │
│ │                         │  │                          ││ │  │
│ │                         │  └──────────────────────────┘│ │  │
│ │                         └──────────────────────────────┘ │  │
│ │                                                            │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Modal Dialogs

### 1. Add Team Member Modal

```
┌──────────────────────────────────────────────┐
│  Add Team Member                          [X]│
├──────────────────────────────────────────────┤
│                                              │
│  Member Email:                               │
│  ┌─────────────────────────────────────────┐ │
│  │ user@example.com                        │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Permission Level:                           │
│  ┌─────────────────────────────────────────┐ │
│  │ View Only - Can view credentials     ▼ │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Options:                                    │
│  • View Only - Can view credentials          │
│  • Edit - Can view and edit credentials      │
│  • Full Management - All permissions         │
│                                              │
│  ┌────────────────────┐ ┌──────────────────┐ │
│  │  Add Member        │ │  Cancel          │ │
│  └────────────────────┘ └──────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

### 2. Edit Member Access Modal

```
┌──────────────────────────────────────────────┐
│  Edit Member Access                       [X]│
├──────────────────────────────────────────────┤
│                                              │
│  Member Email:                               │
│  alice@example.com                           │
│                                              │
│  Permission Level:                           │
│  ┌─────────────────────────────────────────┐ │
│  │ View Only - Can view credentials     ▼ │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Options:                                    │
│  • View Only - Can view credentials          │
│  • Edit - Can view and edit credentials      │
│  • Full Management - All permissions         │
│                                              │
│  ┌────────────────────┐ ┌──────────────────┐ │
│  │  Update Access     │ │  Cancel          │ │
│  └────────────────────┘ └──────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

### 3. Add Team Credential Modal

```
┌──────────────────────────────────────────────┐
│  Add Team Credential                      [X]│
├──────────────────────────────────────────────┤
│                                              │
│  Use Template from Personal Vault:           │
│  ┌─────────────────────────────────────────┐ │
│  │ -- Create from scratch --            ▼ │ │
│  └─────────────────────────────────────────┘ │
│  (GitHub Account, Gmail Account, etc.)      │
│                                              │
│  Title:                                      │
│  ┌─────────────────────────────────────────┐ │
│  │ Credential title                        │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Username:                                   │
│  ┌─────────────────────────────────────────┐ │
│  │ Username                                │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Password:                                   │
│  ┌─────────────────────────────────────────┐ │
│  │ Password                                │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Website URL (optional):                     │
│  ┌─────────────────────────────────────────┐ │
│  │ https://example.com                     │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Notes (optional):                           │
│  ┌─────────────────────────────────────────┐ │
│  │ Any additional notes                    │ │
│  │                                         │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────┐ ┌──────────────────┐ │
│  │  Add Credential    │ │  Cancel          │ │
│  └────────────────────┘ └──────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

## Color Coding

### Permission Badges
- **VIEW_ONLY**: Teal/Blue badge
- **EDIT**: Blue badge  
- **FULL_MANAGEMENT**: Green badge

### Status
- **Active**: Green background
- **Expired**: Yellow/Orange background

### Action Buttons
- **Primary (Add/Update)**: Blue (#0066cc)
- **Secondary (Manage)**: Gray (#6c757d)
- **Danger (Delete/Remove)**: Red (#b00020)
- **Cancel**: Gray (#777)

## Responsive Breakpoints

### Desktop (> 850px)
- Sidebar: 280px wide
- Main content: Flexible width
- Grid layout for credentials
- Table layout for members

### Tablet/Mobile (≤ 850px)
- Sidebar: Full width, above content
- Main content: Full width
- Stacked layout for all panels
- Table converts to responsive grid

## Component Hierarchy

```
Team Vault Section
├── Create Team Card
│   ├── Heading
│   └── Form (Team Name Input + Button)
│
├── Team Vault Shell
│   ├── Sidebar
│   │   └── Team List Panel
│   │       ├── Header (My Teams)
│   │       └── Team Cards (Selectable)
│   │
│   └── Dashboard
│       ├── Team Hero Section
│       │   ├── Team Info (Name, Owner, Access)
│       │   └── Action Buttons
│       │
│       ├── Team Members Panel
│       │   ├── Header with Add Button
│       │   ├── Members Table
│       │   │   ├── Headers
│       │   │   └── Member Rows
│       │   └── Add Member Button
│       │
│       └── Team Credentials Panel
│           ├── Header with Add Button
│           ├── Warning Note
│           ├── Credentials Grid
│           │   └── Credential Cards
│           │       ├── Header (Title, Username, Permission)
│           │       ├── Body (URL, Notes)
│           │       └── Actions (Edit, Delete)
│           └── Add Credential Button
```

## Mobile View Changes

### Desktop Flow
```
Sidebar (280px) | Main Content
```

### Mobile Flow (stacked)
```
Sidebar (full width)
─────────────────
Main Content (full width)
```

### Card Adjustments
- Credentials: 1 column on mobile, 2-3 on desktop
- Members: Full width table converts to stacked rows
- Buttons: Full width on mobile

## Empty States

### No Teams
```
Select a team to open its dashboard.
```

### No Members (when creating team)
```
No team members available.
[+ Add Member]
```

### No Credentials
```
No team credentials available.
[+ Add Credential]
```

## Loading States

- "Loading teams..." - Team list loading
- "Loading team members..." - Members panel loading
- "Loading team credentials..." - Credentials panel loading
- Button shows "Adding...", "Updating...", "Saving..." when in progress

## Success/Error Messages

Messages appear at top of Team Vault section:
- Green for success: "Team member added successfully."
- Red for errors: "Unable to add team member"

## Notes

- **Passwords not exposed**: Only shown in edit modals
- **Minimum 1 credential**: Cannot delete all team credentials
- **Owner protection**: Owner member cannot be removed
- **Permission-based UI**: Buttons only shown if user has permission
- **Real-time updates**: Changes immediately reflected in UI
- **Error handling**: All errors displayed inline and in modals

