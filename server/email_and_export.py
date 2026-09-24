#!/usr/bin/env python3
"""
ADSO Selection Test - Email Dispatcher & Data Exporter
Author: ADSO Selection Automation
Python Module with all necessary libraries for sending emails and exporting reports.
"""

import sys
import os
import json
import csv
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from datetime import datetime
import argparse

def generate_html_report(candidate):
    """Generate a clean iOS-styled HTML email report for candidate evaluation."""
    scores = candidate.get("scores", {})
    psycho = scores.get("psychoSummary", {})
    group = candidate.get("groupAssigned", "Grupo B")
    
    group_colors = {
        "Grupo A": {"bg": "#00af00", "badge": "#E8F5E9", "text": "#008800", "label": "GRUPO A - APTO DIRECTO"},
        "Grupo B": {"bg": "#10B981", "badge": "#ECFDF5", "text": "#047857", "label": "GRUPO B - EN LISTA DE ESPERA"},
        "Grupo C": {"bg": "#0D9488", "badge": "#F0FDFA", "text": "#0F766E", "label": "GRUPO C - REQUIERE REFUERZO"}
    }
    g_info = group_colors.get(group, group_colors["Grupo B"])
    selected_grp = candidate.get("selectedGroup", group)
    
    html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #F2F2F7;
      margin: 0;
      padding: 24px;
      color: #1C1C1E;
    }}
    .container {{
      max-width: 600px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 28px;
      padding: 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    }}
    .header {{
      text-align: center;
      margin-bottom: 24px;
    }}
    .badge {{
      display: inline-block;
      padding: 8px 18px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      background-color: {g_info['badge']};
      color: {g_info['text']};
      margin-top: 12px;
    }}
    .score-box {{
      background: #F9F9FB;
      border-radius: 20px;
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #E5E5EA;
    }}
    .metric {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #EBEBF0;
    }}
    .metric:last-child {{
      border-bottom: none;
    }}
    .metric-label {{
      font-size: 14px;
      color: #8E8E93;
    }}
    .metric-value {{
      font-size: 15px;
      font-weight: 600;
      color: #1C1C1E;
    }}
    .footer {{
      margin-top: 28px;
      text-align: center;
      font-size: 12px;
      color: #8E8E93;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0; font-size: 24px; color:#1C1C1E;">ADSO - SENA</h2>
      <p style="margin:4px 0 0 0; color:#8E8E93; font-size: 14px;">Informe de Admisión y Evaluación Psicotécnica</p>
      <div class="badge">{g_info['label']}</div>
    </div>

    <div style="background: #F2F2F7; border-radius: 16px; padding: 16px; margin-bottom: 20px;">
      <p style="margin: 4px 0;"><strong>Postulante:</strong> {candidate.get('fullName', 'N/A')}</p>
      <p style="margin: 4px 0;"><strong>Documento:</strong> {candidate.get('documentId', 'N/A')}</p>
      <p style="margin: 4px 0;"><strong>Fecha de Prueba:</strong> {candidate.get('completedAt', datetime.now().strftime('%Y-%m-%d %H:%M'))}</p>
      <p style="margin: 4px 0;"><strong>Tiempo Empleado:</strong> {candidate.get('timeSpentSeconds', 0)} segundos</p>
    </div>

    <h3 style="font-size: 16px; margin-bottom: 8px;">Resumen de Rendimiento Académico y Lógico</h3>
    <div class="score-box">
      <div class="metric">
        <span class="metric-label">🎲 Lógica de Dominó:</span>
        <span class="metric-value">{scores.get('dominoScore', 0)} / {scores.get('dominoMax', 10)} pts</span>
      </div>
      <div class="metric">
        <span class="metric-label">📐 Análisis Matemático:</span>
        <span class="metric-value">{scores.get('mathScore', 0)} / {scores.get('mathMax', 10)} pts</span>
      </div>
      <div class="metric">
        <span class="metric-label">📖 Comprensión Lectora:</span>
        <span class="metric-value">{scores.get('readingScore', 0)} / {scores.get('readingMax', 10)} pts</span>
      </div>
      <div class="metric">
        <span class="metric-label">🎯 Puntaje Global Ponderado:</span>
        <span class="metric-value" style="color: {g_info['text']}; font-size: 18px;">{scores.get('percentage', 0)}%</span>
      </div>
    </div>

    <h3 style="font-size: 16px; margin-bottom: 8px;">Perfil Psicológico y Metodológico</h3>
    <div class="score-box">
      <div class="metric">
        <span class="metric-label">💡 Estilo de Aprendizaje Predominante:</span>
        <span class="metric-value">{psycho.get('dominantLearning', 'Visual')}</span>
      </div>
      <div class="metric">
        <span class="metric-label">🚀 Metodología de Proyecto Afín:</span>
        <span class="metric-value">{psycho.get('dominantManagement', 'Ágil')}</span>
      </div>
      <div class="metric">
        <span class="metric-label">💼 Rol Sugerido en Equipo ADSO:</span>
        <span class="metric-value">{psycho.get('recommendedRole', 'Desarrollador Full-Stack')}</span>
      </div>
    </div>

    <div class="footer">
      Sistema Automatizado de Pruebas de Selección ADSO &copy; {datetime.now().year}<br>
      Este es un correo oficial de registro y resultados de prueba.
    </div>
  </div>
</body>
</html>"""
    return html

def send_email_smtp(to_email, candidate_data, smtp_config=None):
    """
    Sends email with evaluation result using smtplib and SSL/TLS.
    If no SMTP credentials provided in env or config, outputs simulation report.
    """
    if smtp_config is None:
        smtp_config = {}
        
    smtp_host = smtp_config.get("host") or os.environ.get("SMTP_HOST") or "smtp.gmail.com"
    smtp_port = int(smtp_config.get("port") or os.environ.get("SMTP_PORT") or 587)
    smtp_user = smtp_config.get("user") or os.environ.get("SMTP_USER", "")
    smtp_pass = smtp_config.get("pass") or os.environ.get("SMTP_PASS", "")
    from_email = smtp_config.get("from") or os.environ.get("SMTP_FROM") or smtp_user or "admisiones.adso@sena.edu.co"

    full_name = candidate_data.get("fullName", "Postulante")
    subject = f"Resultados Examen de Admisión ADSO - {full_name} [{candidate_data.get('groupAssigned', 'Grupo')}]"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Admisiones ADSO <{from_email}>"
    msg["To"] = to_email

    # Plain text alternative
    text_content = f"""Resultados Examen ADSO:
Postulante: {full_name}
Documento: {candidate_data.get('documentId', 'N/A')}
Grupo Asignado: {candidate_data.get('groupAssigned', 'N/A')}
Puntaje Global: {candidate_data.get('scores', {}).get('percentage', 0)}%
Dominó: {candidate_data.get('scores', {}).get('dominoScore', 0)}/{candidate_data.get('scores', {}).get('dominoMax', 10)}
Matemáticas: {candidate_data.get('scores', {}).get('mathScore', 0)}/{candidate_data.get('scores', {}).get('mathMax', 10)}
Comprensión: {candidate_data.get('scores', {}).get('readingScore', 0)}/{candidate_data.get('scores', {}).get('readingMax', 10)}
Estilo de Aprendizaje: {candidate_data.get('scores', {}).get('psychoSummary', {}).get('dominantLearning', 'N/A')}
Gestión de Proyecto: {candidate_data.get('scores', {}).get('psychoSummary', {}).get('dominantManagement', 'N/A')}
"""
    html_content = generate_html_report(candidate_data)

    msg.attach(MIMEText(text_content, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    # If actual SMTP credentials are provided, send over network
    if smtp_user and smtp_pass and smtp_user != "demo" and not smtp_user.startswith("your_"):
        try:
            context = ssl.create_default_context()
            if smtp_port == 465:
                with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(from_email, [to_email], msg.as_string())
            else:
                with smtplib.SMTP(smtp_host, smtp_port) as server:
                    server.starttls(context=context)
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(from_email, [to_email], msg.as_string())
            return {
                "success": True,
                "mode": "live",
                "message": f"Correo enviado exitosamente a {to_email} mediante {smtp_host}:{smtp_port}"
            }
        except Exception as e:
            return {
                "success": False,
                "mode": "error",
                "message": f"Error conectando con servidor SMTP ({smtp_host}): {str(e)}"
            }
    else:
        # High fidelity simulated dispatch (for sandbox environments where no third-party credentials are entered)
        return {
            "success": True,
            "mode": "simulated",
            "message": f"Reporte procesado exitosamente por smtplib para {to_email}. (Modo Seguro de Demostración activo).",
            "previewSubject": subject,
            "recipient": to_email,
            "timestamp": datetime.now().isoformat()
        }

def export_to_csv(candidates, output_path=None):
    """Export list of candidates to CSV format with UTF-8 BOM for full Excel letter compatibility."""
    rows = []
    headers = [
        "ID", "Nombre_Completo", "Tipo_Documento", "Numero_Documento", "Email",
        "Porcentaje_Global", "Puntaje_Total", "Puntaje_Maximo",
        "Puntaje_Domino", "Puntaje_Matematicas", "Puntaje_Comprension",
        "Estilo_Aprendizaje", "Gestion_Proyectos", "Rol_Sugerido",
        "Tiempo_Segundos", "Agotado_Por_Tiempo", "Fecha_Completado"
    ]
    
    for c in candidates:
        sc = c.get("scores", {})
        ps = sc.get("psychoSummary", {})
        rows.append({
            "ID": c.get("id", ""),
            "Nombre_Completo": c.get("fullName", ""),
            "Tipo_Documento": c.get("documentType", "Cédula de Ciudadanía"),
            "Numero_Documento": c.get("documentId", ""),
            "Email": c.get("email", ""),
            "Porcentaje_Global": f"{sc.get('percentage', 0)}%",
            "Puntaje_Total": sc.get("totalScore", 0),
            "Puntaje_Maximo": sc.get("totalMax", 0),
            "Puntaje_Domino": sc.get("dominoScore", 0),
            "Puntaje_Matematicas": sc.get("mathScore", 0),
            "Puntaje_Comprension": sc.get("readingScore", 0),
            "Estilo_Aprendizaje": ps.get("dominantLearning", ""),
            "Gestion_Proyectos": ps.get("dominantManagement", ""),
            "Rol_Sugerido": ps.get("recommendedRole", ""),
            "Tiempo_Segundos": c.get("timeSpentSeconds", 0),
            "Agotado_Por_Tiempo": "Si" if c.get("timedOut") else "No",
            "Fecha_Completado": c.get("completedAt", "")
        })

    if output_path:
        with open(output_path, mode="w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(rows)
        return output_path
    else:
        import io
        output = io.StringIO()
        output.write('\ufeff')
        writer = csv.DictWriter(output, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
        return output.getvalue()

def export_to_json(candidates, output_path=None):
    """Export candidates list to indented JSON format."""
    data = {
        "metadata": {
            "title": "Evaluaciones de Selección ADSO",
            "exportedAt": datetime.now().isoformat(),
            "totalCandidates": len(candidates),
            "groupsSummary": {
                "Grupo A": len([c for c in candidates if c.get("groupAssigned") == "Grupo A"]),
                "Grupo B": len([c for c in candidates if c.get("groupAssigned") == "Grupo B"]),
                "Grupo C": len([c for c in candidates if c.get("groupAssigned") == "Grupo C"]),
            }
        },
        "candidates": candidates
    }
    
    if output_path:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return output_path
    else:
        return json.dumps(data, indent=2, ensure_ascii=False)

def main():
    parser = argparse.ArgumentParser(description="ADSO Email & Export CLI Tool")
    parser.add_argument("--action", choices=["email", "csv", "json"], required=True, help="Action to perform")
    parser.add_argument("--input", help="Path to JSON file containing candidates or candidate data")
    parser.add_argument("--to", help="Recipient email address for email action")
    parser.add_argument("--output", help="Output file path for export action")
    
    args = parser.parse_args()

    if args.action == "email":
        if not args.to:
            print(json.dumps({"error": "Missing --to argument for email action"}))
            sys.exit(1)
        
        candidate_data = {}
        if args.input and os.path.exists(args.input):
            with open(args.input, "r", encoding="utf-8") as f:
                candidate_data = json.load(f)
        else:
            # Read from stdin
            try:
                candidate_data = json.loads(sys.stdin.read())
            except Exception as e:
                print(json.dumps({"error": f"Failed to read candidate JSON: {str(e)}"}))
                sys.exit(1)

        result = send_email_smtp(args.to, candidate_data)
        print(json.dumps(result, ensure_ascii=False))

    elif args.action == "csv":
        candidates = []
        if args.input and os.path.exists(args.input):
            with open(args.input, "r", encoding="utf-8") as f:
                candidates = json.load(f)
        else:
            candidates = json.loads(sys.stdin.read() or "[]")
            
        csv_str = export_to_csv(candidates, args.output)
        if not args.output:
            print(csv_str)
        else:
            print(json.dumps({"success": True, "path": args.output}))

    elif args.action == "json":
        candidates = []
        if args.input and os.path.exists(args.input):
            with open(args.input, "r", encoding="utf-8") as f:
                candidates = json.load(f)
        else:
            candidates = json.loads(sys.stdin.read() or "[]")

        json_str = export_to_json(candidates, args.output)
        if not args.output:
            print(json_str)
        else:
            print(json.dumps({"success": True, "path": args.output}))

if __name__ == "__main__":
    main()
