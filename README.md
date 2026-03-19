# GIS地理信息系统

## 项目简介

GIS地理信息系统是一个基于Web的地理信息管理平台，支持DWG图纸解析、地图标注、信息管理等功能，满足工程图纸在线浏览和标注需求。

## 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **UI库**: Element Plus
- **地图引擎**: Leaflet
- **构建工具**: Vite
- **状态管理**: Pinia

### 后端
- **语言**: Node.js + TypeScript
- **框架**: Express
- **数据库**: MongoDB
- **文件上传**: Multer
- **DWG解析**: Python + ezdxf

### 部署
- **容器化**: Docker + Docker Compose
- **Web服务器**: Nginx

## 功能特性

### 1. DWG文件管理
- 支持DWG/DXF文件上传（最大100MB）
- 自动解析DWG文件为Web可展示格式
- 提取图层信息和空间边界
- 支持图层显示/隐藏控制

### 2. 地图标注功能
- 点击地图添加标注点
- 支持多种标点类型（普通点、重要点、监测点、设备点、危险点）
- 绘制线、多边形、圆形、矩形
- 自定义标注样式和属性

### 3. 标注信息管理
- 详细的标点信息录入（名称、类型、描述、坐标等）
- 支持富文本描述和多媒体附件
- 强大的查询和筛选功能
- 支持Excel/CSV/GeoJSON/KML/Shapefile导出

### 4. 项目管理
- 多项目支持
- 项目级权限控制
- 成员管理和角色分配
- 自定义坐标系统和底图

### 5. 底图切换
- 高德地图
- 百度地图
- 天地图
- OpenStreetMap
- 卫星影像

## 项目结构

```
gis-system/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── api/                 # API接口
│   │   ├── assets/              # 静态资源
│   │   ├── components/          # 组件
│   │   │   ├── common/          # 通用组件
│   │   │   ├── map/             # 地图组件
│   │   │   └── dwg/             # DWG组件
│   │   ├── composables/         # 组合式函数
│   │   ├── router/              # 路由
│   │   ├── stores/              # Pinia状态管理
│   │   ├── styles/              # 样式
│   │   ├── types/               # TypeScript类型
│   │   ├── utils/               # 工具函数
│   │   ├── views/               # 页面视图
│   │   │   ├── login/           # 登录页面
│   │   │   ├── project/         # 项目管理
│   │   │   ├── map/             # 地图页面
│   │   │   └── admin/           # 管理页面
│   │   ├── App.vue              # 根组件
│   │   └── main.ts              # 入口文件
│   ├── public/                  # 静态文件
│   ├── index.html               # HTML模板
│   ├── package.json             # 依赖配置
│   ├── tsconfig.json            # TypeScript配置
│   └── vite.config.ts           # Vite配置
│
├── backend/                     # 后端项目
│   ├── src/
│   │   ├── config/              # 配置
│   │   ├── controllers/         # 控制器
│   │   ├── middlewares/         # 中间件
│   │   ├── models/              # 数据模型
│   │   ├── routes/              # 路由
│   │   ├── services/            # 业务逻辑
│   │   ├── types/               # TypeScript类型
│   │   ├── utils/               # 工具函数
│   │   ├── app.ts               # Express应用
│   │   └── index.ts             # 入口文件
│   ├── scripts/                 # Python脚本
│   │   └── parse_dwg.py         # DWG解析
│   ├── uploads/                 # 上传文件
│   ├── package.json             # 依赖配置
│   ├── tsconfig.json            # TypeScript配置
│   ├── Dockerfile               # Docker构建文件
│   └── docker-compose.yml       # Docker Compose配置
│
├── .gitignore                   # Git忽略文件
└── README.md                    # 项目说明
```

## 快速开始

### 环境要求
- **Node.js**: 18.0+
- **MongoDB**: 7.0+
- **Python**: 3.7+ (用于DWG解析)
- **Docker** (可选，用于容器化部署)

### 本地开发

#### 1. 启动后端服务
```bash
cd backend
npm install
npm run dev
# 服务将运行在 http://localhost:3001
```

#### 2. 启动前端服务
```bash
cd frontend
npm install
npm run dev
# 服务将运行在 http://localhost:3000
```

### Docker部署

#### 1. 构建和启动容器
```bash
cd backend
docker-compose up -d
# 服务将运行在 http://localhost
```

#### 2. 停止容器
```bash
docker-compose down
```

## API接口

### 项目管理
- `POST /api/projects` - 创建项目
- `GET /api/projects` - 获取项目列表
- `GET /api/projects/:id` - 获取项目详情
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目

### DWG文件
- `POST /api/dwg/upload` - 上传DWG文件
- `GET /api/dwg/:id` - 获取DWG文件信息
- `POST /api/dwg/:id/parse` - 解析DWG文件
- `GET /api/dwg/:id/layers` - 获取图层列表
- `DELETE /api/dwg/:id` - 删除DWG文件

### 标注管理
- `POST /api/markers` - 创建标注
- `GET /api/markers` - 查询标注
- `PUT /api/markers/:id` - 更新标注
- `DELETE /api/markers/:id` - 删除标注
- `POST /api/markers/batch` - 批量操作
- `GET /api/markers/export` - 导出标注

## 开发指南

### 前端开发
1. 新增组件：在 `frontend/src/components` 目录下创建
2. 新增页面：在 `frontend/src/views` 目录下创建
3. 新增API：在 `frontend/src/api` 目录下创建
4. 状态管理：使用 Pinia 存储在 `frontend/src/stores` 目录下

### 后端开发
1. 新增模型：在 `backend/src/models` 目录下创建
2. 新增控制器：在 `backend/src/controllers` 目录下创建
3. 新增路由：在 `backend/src/routes` 目录下创建
4. 新增服务：在 `backend/src/services` 目录下创建

### DWG解析
- Python脚本位于 `backend/scripts/parse_dwg.py`
- 使用 ezdxf 库解析DWG文件
- 支持 LINE, CIRCLE, TEXT, LWPOLYLINE, POLYLINE 等实体类型

## 注意事项

1. **DWG解析**：需要安装 Python 和 ezdxf 库
   ```bash
   pip install ezdxf
   ```

2. **文件上传**：默认最大文件大小为100MB，可在 `backend/src/controllers/dwgController.ts` 中修改

3. **数据库**：默认连接到 `mongodb://localhost:27017/gis_system`，可通过环境变量 `MONGO_URI` 修改

4. **端口**：前端默认运行在3000端口，后端默认运行在3001端口

## 许可证

MIT License

## 维护者

- 产品团队
- 技术团队

## 更新日志

- **v1.0.0** (2026-03-19)：项目初始化，完成核心功能开发
