import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.EMAILS_FROM_EMAIL
        self.from_name = settings.EMAILS_FROM_NAME

    def send_email(
        self,
        recipient_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        if not all([self.smtp_host, self.smtp_user, self.smtp_password, self.from_email]):
            logger.warning("Email settings not fully configured. Skipping email send.")
            return False

        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{self.from_name} <{self.from_email}>"
        message["To"] = recipient_email

        if text_content:
            part1 = MIMEText(text_content, "plain")
            message.attach(part1)

        part2 = MIMEText(html_content, "html")
        message.attach(part2)

        try:
            if settings.SMTP_SSL:
                # Use SMTP_SSL for port 465
                with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port) as server:
                    server.login(self.smtp_user, self.smtp_password)
                    server.sendmail(self.from_email, recipient_email, message.as_string())
            else:
                # Use SMTP with STARTTLS for port 587
                with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                    if settings.SMTP_TLS:
                        server.starttls()
                    server.login(self.smtp_user, self.smtp_password)
                    server.sendmail(self.from_email, recipient_email, message.as_string())
            return True
        except Exception as e:
            logger.error(f"Error sending email to {recipient_email}: {str(e)}")
            return False

    def send_shipment_update(self, recipient_email: str, shipment_id: str, status: str):
        subject = f"Shipment Update: {shipment_id}"
        html_content = f"""
        <html>
            <body>
                <h2>Shipment Status Update</h2>
                <p>Your shipment <strong>{shipment_id}</strong> has a new status: <strong>{status}</strong>.</p>
                <p>Login to your dashboard to see more details.</p>
            </body>
        </html>
        """
        return self.send_email(recipient_email, subject, html_content)
    
    def get_welcome_mail_content(self, recipient_email: str, first_name: str, verification_url: str):
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
                    
                    body {{
                        margin: 0;
                        padding: 0;
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background-color: #050505;
                        color: #ffffff;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 0 auto;
                        background: linear-gradient(135deg, #0A0A0A 0%, #050505 100%);
                    }}
                    .header {{
                        padding: 40px 40px 20px;
                        text-align: center;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    }}
                    .logo {{
                        font-size: 28px;
                        font-weight: 800;
                        letter-spacing: -0.02em;
                        color: #ffffff;
                        text-transform: uppercase;
                    }}
                    .logo-accent {{
                        color: #FF8A00;
                    }}
                    .badge {{
                        display: inline-block;
                        padding: 6px 12px;
                        background: rgba(255, 138, 0, 0.1);
                        border: 1px solid rgba(255, 138, 0, 0.2);
                        border-radius: 20px;
                        color: #FF8A00;
                        font-size: 10px;
                        font-weight: 700;
                        letter-spacing: 0.15em;
                        text-transform: uppercase;
                        margin-top: 20px;
                    }}
                    .content {{
                        padding: 40px;
                    }}
                    .greeting {{
                        font-size: 32px;
                        font-weight: 800;
                        margin: 0 0 20px;
                        background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.5) 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }}
                    .message {{
                        font-size: 16px;
                        line-height: 1.6;
                        color: rgba(255, 255, 255, 0.7);
                        margin: 0 0 30px;
                    }}
                    .cta-container {{
                        text-align: center;
                        margin: 40px 0;
                    }}
                    .cta-button {{
                        display: inline-block;
                        padding: 16px 40px;
                        background: #FF8A00;
                        color: #000000;
                        text-decoration: none;
                        border-radius: 16px;
                        font-weight: 800;
                        font-size: 14px;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        box-shadow: 0 0 30px rgba(255, 138, 0, 0.3);
                        transition: all 0.3s ease;
                    }}
                    .cta-button:hover {{
                        box-shadow: 0 0 40px rgba(255, 138, 0, 0.5);
                        transform: translateY(-2px);
                    }}
                    .features {{
                        background: rgba(255, 255, 255, 0.02);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-radius: 24px;
                        padding: 30px;
                        margin: 30px 0;
                    }}
                    .feature-item {{
                        display: flex;
                        align-items: start;
                        margin-bottom: 20px;
                    }}
                    .feature-item:last-child {{
                        margin-bottom: 0;
                    }}
                    .feature-icon {{
                        width: 40px;
                        height: 40px;
                        background: rgba(255, 138, 0, 0.1);
                        border: 1px solid rgba(255, 138, 0, 0.2);
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 16px;
                        flex-shrink: 0;
                    }}
                    .feature-text {{
                        flex: 1;
                    }}
                    .feature-title {{
                        font-weight: 700;
                        font-size: 14px;
                        color: #ffffff;
                        margin: 0 0 4px;
                    }}
                    .feature-desc {{
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.5);
                        margin: 0;
                    }}
                    .footer {{
                        padding: 30px 40px;
                        text-align: center;
                        border-top: 1px solid rgba(255, 255, 255, 0.05);
                    }}
                    .footer-text {{
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.4);
                        margin: 0 0 10px;
                    }}
                    .footer-link {{
                        color: #FF8A00;
                        text-decoration: none;
                    }}
                    .divider {{
                        height: 1px;
                        background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
                        margin: 30px 0;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">
                            <span class="logo-accent">DEKKS</span>
                        </div>
                        <div class="badge">Fleet Management Platform</div>
                    </div>
                    
                    <div class="content">
                        <h1 class="greeting">Welcome aboard, {first_name}! 🎉</h1>
                        
                        <p class="message">
                            You've just unlocked access to the most advanced shipment tracking platform. 
                            Your fleet management journey starts here.
                        </p>
                        
                        <div class="cta-container">
                            <a href="{verification_url}" class="cta-button">Verify Email Address</a>
                        </div>
                        
                        <p class="message" style="text-align: center; font-size: 13px; margin-top: 20px;">
                            This link will expire in 24 hours for security purposes.
                        </p>
                        
                        <div class="divider"></div>
                        
                        <div class="features">
                            <div class="feature-item">
                                <div class="feature-icon">🗺️</div>
                                <div class="feature-text">
                                    <p class="feature-title">Real-Time Fleet Tracking</p>
                                    <p class="feature-desc">Monitor your vessels on an interactive global map with live updates</p>
                                </div>
                            </div>
                            
                            <div class="feature-item">
                                <div class="feature-icon">📊</div>
                                <div class="feature-text">
                                    <p class="feature-title">Advanced Analytics</p>
                                    <p class="feature-desc">Get insights on delivery performance, ETA accuracy, and fleet efficiency</p>
                                </div>
                            </div>
                            
                            <div class="feature-item">
                                <div class="feature-icon">🔔</div>
                                <div class="feature-text">
                                    <p class="feature-title">Smart Notifications</p>
                                    <p class="feature-desc">Stay informed with automated alerts for shipment status changes</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="divider"></div>
                        
                        <p class="message" style="font-size: 14px;">
                            <strong>Need help getting started?</strong><br>
                            Our support team is here 24/7. Just reply to this email or visit our help center.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p class="footer-text">
                            If you didn't create this account, you can safely ignore this email.
                        </p>
                        <p class="footer-text">
                            © 2026 Dekks. All rights reserved.
                        </p>
                        <p class="footer-text">
                            <a href="#" class="footer-link">Privacy Policy</a> • 
                            <a href="#" class="footer-link">Terms of Service</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
            return html_content

    def send_welcome_email(self, recipient_email: str, first_name: str, verification_url: str):
        subject = "🚢 Welcome to Dekks - Verify Your Account"
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
                
                body {{
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background-color: #050505;
                    color: #ffffff;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, #0A0A0A 0%, #050505 100%);
                }}
                .header {{
                    padding: 40px 40px 20px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }}
                .logo {{
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #ffffff;
                    text-transform: uppercase;
                }}
                .logo-accent {{
                    color: #FF8A00;
                }}
                .badge {{
                    display: inline-block;
                    padding: 6px 12px;
                    background: rgba(255, 138, 0, 0.1);
                    border: 1px solid rgba(255, 138, 0, 0.2);
                    border-radius: 20px;
                    color: #FF8A00;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    margin-top: 20px;
                }}
                .content {{
                    padding: 40px;
                }}
                .greeting {{
                    font-size: 32px;
                    font-weight: 800;
                    margin: 0 0 20px;
                    background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.5) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }}
                .message {{
                    font-size: 16px;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0 0 30px;
                }}
                .cta-container {{
                    text-align: center;
                    margin: 40px 0;
                }}
                .cta-button {{
                    display: inline-block;
                    padding: 16px 40px;
                    background: #FF8A00;
                    color: #000000;
                    text-decoration: none;
                    border-radius: 16px;
                    font-weight: 800;
                    font-size: 14px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    box-shadow: 0 0 30px rgba(255, 138, 0, 0.3);
                    transition: all 0.3s ease;
                }}
                .cta-button:hover {{
                    box-shadow: 0 0 40px rgba(255, 138, 0, 0.5);
                    transform: translateY(-2px);
                }}
                .features {{
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 30px;
                    margin: 30px 0;
                }}
                .feature-item {{
                    display: flex;
                    align-items: start;
                    margin-bottom: 20px;
                }}
                .feature-item:last-child {{
                    margin-bottom: 0;
                }}
                .feature-icon {{
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 138, 0, 0.1);
                    border: 1px solid rgba(255, 138, 0, 0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    flex-shrink: 0;
                }}
                .feature-text {{
                    flex: 1;
                }}
                .feature-title {{
                    font-weight: 700;
                    font-size: 14px;
                    color: #ffffff;
                    margin: 0 0 4px;
                }}
                .feature-desc {{
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.5);
                    margin: 0;
                }}
                .footer {{
                    padding: 30px 40px;
                    text-align: center;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }}
                .footer-text {{
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.4);
                    margin: 0 0 10px;
                }}
                .footer-link {{
                    color: #FF8A00;
                    text-decoration: none;
                }}
                .divider {{
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
                    margin: 30px 0;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">
                        <span class="logo-accent">DEKKS</span>
                    </div>
                    <div class="badge">Fleet Management Platform</div>
                </div>
                
                <div class="content">
                    <h1 class="greeting">Welcome aboard, {first_name}! 🎉</h1>
                    
                    <p class="message">
                        You've just unlocked access to the most advanced shipment tracking platform. 
                        Your fleet management journey starts here.
                    </p>
                    
                    <div class="cta-container">
                        <a href="{verification_url}" class="cta-button">Verify Email Address</a>
                    </div>
                    
                    <p class="message" style="text-align: center; font-size: 13px; margin-top: 20px;">
                        This link will expire in 24 hours for security purposes.
                    </p>
                    
                    <div class="divider"></div>
                    
                    <div class="features">
                        <div class="feature-item">
                            <div class="feature-icon">🗺️</div>
                            <div class="feature-text">
                                <p class="feature-title">Real-Time Fleet Tracking</p>
                                <p class="feature-desc">Monitor your vessels on an interactive global map with live updates</p>
                            </div>
                        </div>
                        
                        <div class="feature-item">
                            <div class="feature-icon">📊</div>
                            <div class="feature-text">
                                <p class="feature-title">Advanced Analytics</p>
                                <p class="feature-desc">Get insights on delivery performance, ETA accuracy, and fleet efficiency</p>
                            </div>
                        </div>
                        
                        <div class="feature-item">
                            <div class="feature-icon">🔔</div>
                            <div class="feature-text">
                                <p class="feature-title">Smart Notifications</p>
                                <p class="feature-desc">Stay informed with automated alerts for shipment status changes</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <p class="message" style="font-size: 14px;">
                        <strong>Need help getting started?</strong><br>
                        Our support team is here 24/7. Just reply to this email or visit our help center.
                    </p>
                </div>
                
                <div class="footer">
                    <p class="footer-text">
                        If you didn't create this account, you can safely ignore this email.
                    </p>
                    <p class="footer-text">
                        © 2026 Dekks. All rights reserved.
                    </p>
                    <p class="footer-text">
                        <a href="#" class="footer-link">Privacy Policy</a> • 
                        <a href="#" class="footer-link">Terms of Service</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        return self.send_email(recipient_email, subject, html_content)

email_service = EmailService()
