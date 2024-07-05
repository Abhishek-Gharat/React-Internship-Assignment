// Sidebar.tsx
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Checkbox, Collapse, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import departmentData from '../data/departmentData.json';

interface Department {
  department: string;
  sub_departments: string[];
}

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (department: string) => {
    setExpanded(prev => ({ ...prev, [department]: !prev[department] }));
  };

  const handleSelect = (department: string, isSubDepartment: boolean = false) => {
    setSelected(prev => {
      const newSelected = { ...prev };
      if (isSubDepartment) {
        newSelected[department] = !prev[department];
        const parentDept = departmentData.find((dept: Department) => dept.sub_departments.includes(department))!;
        const allChildrenSelected = parentDept.sub_departments.every((subDept: string) => newSelected[subDept]);
        newSelected[parentDept.department] = allChildrenSelected;
      } else {
        newSelected[department] = !prev[department];
        departmentData.find((dept: Department) => dept.department === department)!.sub_departments.forEach((subDept: string) => {
          newSelected[subDept] = newSelected[department];
        });
      }
      return newSelected;
    });
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: { xs: 240, sm: 240, md: 300 },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: 240, sm: 240, md: 300 },
          boxSizing: 'border-box',
          paddingTop: '20px',
          paddingRight: '10px',
        },
      }}
    >
      <List>
        {departmentData.map((dept: Department) => (
          <React.Fragment key={dept.department}>
            <ListItem sx={{ justifyContent: 'space-between' }}>
              <IconButton onClick={() => handleToggle(dept.department)}>
                {expanded[dept.department] ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
              </IconButton>
              <ListItemIcon sx={{ minWidth: 'auto', marginLeft: '10px' }}>
                <Checkbox
                  edge="start"
                  checked={selected[dept.department] || false}
                  onChange={() => handleSelect(dept.department)}
                />
              </ListItemIcon>
              <ListItemText primary={`${dept.department} (${dept.sub_departments.length})`} sx={{ flex: '1 1 auto', marginLeft: '10px' }} />
            </ListItem>
            <Collapse in={expanded[dept.department]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {dept.sub_departments.map((subDept: string) => (
                  <ListItem key={subDept} sx={{ pl: 8 }}>
                    <ListItemIcon sx={{ minWidth: 'auto', marginRight: '10px' }}>
                      <Checkbox
                        edge="start"
                        checked={selected[subDept] || false}
                        onChange={() => handleSelect(subDept, true)}
                      />
                    </ListItemIcon>
                    <ListItemText primary={subDept} sx={{ flex: '1 1 auto' }} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
