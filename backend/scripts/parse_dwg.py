#!/usr/bin/env python3
import sys
import json

try:
    import ezdxf
except ImportError:
    print(json.dumps({'success': False, 'error': '缺少ezdxf库，请运行: pip install ezdxf'}))
    sys.exit(1)

def parse_entity(entity):
    t = entity.dxftype()
    if t == 'LINE':
        return {
            'type': 'LINE',
            'start': {'x': entity.dxf.start.x, 'y': entity.dxf.start.y},
            'end': {'x': entity.dxf.end.x, 'y': entity.dxf.end.y},
            'color': entity.dxf.color
        }
    elif t == 'CIRCLE':
        return {
            'type': 'CIRCLE',
            'center': {'x': entity.dxf.center.x, 'y': entity.dxf.center.y},
            'radius': entity.dxf.radius,
            'color': entity.dxf.color
        }
    elif t == 'TEXT':
        return {
            'type': 'TEXT',
            'position': {'x': entity.dxf.insert.x, 'y': entity.dxf.insert.y},
            'text': entity.dxf.text,
            'height': entity.dxf.height,
            'color': entity.dxf.color
        }
    elif t == 'LWPOLYLINE':
        return {
            'type': 'LWPOLYLINE',
            'points': [{'x': p[0], 'y': p[1]} for p in entity.get_points()],
            'is_closed': entity.closed,
            'color': entity.dxf.color
        }
    elif t == 'POLYLINE':
        return {
            'type': 'POLYLINE',
            'points': [{'x': v.dxf.location.x, 'y': v.dxf.location.y} for v in entity.vertices],
            'is_closed': entity.dxf.closed,
            'color': entity.dxf.color
        }
    return None

def parse_dwg(file_path):
    try:
        doc = ezdxf.readfile(file_path)
        msp = doc.modelspace()
        
        layers = {}
        bounds = {'minX': float('inf'), 'minY': float('inf'), 'maxX': float('-inf'), 'maxY': float('-inf')}
        
        for entity in msp:
            layer_name = entity.dxf.layer
            if layer_name not in layers:
                layers[layer_name] = {'name': layer_name, 'entities': []}
            
            data = parse_entity(entity)
            if data:
                layers[layer_name]['entities'].append(data)
                # 更新边界
                if 'start' in data:
                    bounds['minX'] = min(bounds['minX'], data['start']['x'])
                    bounds['minY'] = min(bounds['minY'], data['start']['y'])
                    bounds['maxX'] = max(bounds['maxX'], data['start']['x'])
                    bounds['maxY'] = max(bounds['maxY'], data['start']['y'])
                    bounds['minX'] = min(bounds['minX'], data['end']['x'])
                    bounds['minY'] = min(bounds['minY'], data['end']['y'])
                    bounds['maxX'] = max(bounds['maxX'], data['end']['x'])
                    bounds['maxY'] = max(bounds['maxY'], data['end']['y'])
                elif 'center' in data:
                    bounds['minX'] = min(bounds['minX'], data['center']['x'] - data['radius'])
                    bounds['minY'] = min(bounds['minY'], data['center']['y'] - data['radius'])
                    bounds['maxX'] = max(bounds['maxX'], data['center']['x'] + data['radius'])
                    bounds['maxY'] = max(bounds['maxY'], data['center']['y'] + data['radius'])
                elif 'points' in data:
                    for point in data['points']:
                        bounds['minX'] = min(bounds['minX'], point['x'])
                        bounds['minY'] = min(bounds['minY'], point['y'])
                        bounds['maxX'] = max(bounds['maxX'], point['x'])
                        bounds['maxY'] = max(bounds['maxY'], point['y'])
                elif 'position' in data:
                    bounds['minX'] = min(bounds['minX'], data['position']['x'])
                    bounds['minY'] = min(bounds['minY'], data['position']['y'])
                    bounds['maxX'] = max(bounds['maxX'], data['position']['x'])
                    bounds['maxY'] = max(bounds['maxY'], data['position']['y'])
        
        # 处理边界值
        if bounds['minX'] == float('inf'):
            bounds = {'minX': 0, 'minY': 0, 'maxX': 100, 'maxY': 100}
        
        return {'success': True, 'layers': list(layers.values()), 'bounds': bounds}
    except Exception as e:
        return {'success': False, 'error': str(e)}

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': '缺少文件路径'}))
        sys.exit(1)
    
    result = parse_dwg(sys.argv[1])
    print(json.dumps(result, ensure_ascii=False))
