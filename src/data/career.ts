import type { CareerEntry } from '../types/career';

export const careerEntries: readonly CareerEntry[] = [
  {
    org: '株式会社ダンクソフト',
    events: [
      { date: '2026年2月', roles: '退社' },
      {
        date: '2024年4月',
        roles: '部署マネージャー、プロジェクトリーダー、テックリード',
        skills: ['Cybozu kintone', 'HTML', 'CSS', 'JavaScript（Vanilla、jQuery）', 'UI設計', 'Microsoft Excel']
      },
      {
        date: '2016年4月',
        roles: 'プロジェクトリーダー、テックリード',
        skills: ['Nulab Backlog', 'HTML', 'CSS', 'JavaScript（Vanilla、jQuery）', 'UI設計', 'Microsoft Excel']
      },
      {
        date: '2011年4月',
        roles: '異動、ウェブエンジニア',
        skills: [
          'HTML',
          'CSS',
          'JavaScript（Vanilla、jQuery）',
          'コマンドプロンプト',
          'Powershell',
          'WordPress',
          'PHP',
          'Windows Server (IIS)',
          'Microsoft Azure Appservice'
        ]
      },
      {
        date: '2009年4月',
        roles: 'システムエンジニア、インフラエンジニア',
        skills: ['C#', '.NET Framework', 'Windows Server', 'Microsoft Dynamics（CRM）']
      },
      {
        date: '2008年4月',
        roles: '入社',
        skills: ['Microsoft Outlook', 'Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint']
      }
    ]
  },
  {
    org: '新潟大学大学院 自然科学研究科',
    events: [{ date: '2008年3月', roles: '卒業' }]
  },
  {
    org: '長岡技術科学大学 生物機能工学課程',
    events: [{ date: '2006年3月', roles: '卒業' }]
  }
];
