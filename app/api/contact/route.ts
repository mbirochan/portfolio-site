import { NextResponse } from 'next/server';
import { emailService, contactFormSchema } from '@/lib/email';

// Mark route as dynamic and set runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Configure CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, { 
    headers: corsHeaders,
    status: 200 
  });
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log('Received form data:', body);
    
    // Validate the request body
    const validation = contactFormSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('Validation error:', validation.error.format());
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid form data',
          details: validation.error.format()
        },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Check if email service is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Email service not configured');
      return NextResponse.json(
        { 
          success: false,
          error: 'Email service not configured. Please add GMAIL_USER and GMAIL_APP_PASSWORD to your environment variables.'
        },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    // Send email
    try {
      await emailService.sendContactEmail(validation.data);
      
      // Return success response
      return NextResponse.json(
        {
          success: true,
          message: validation.data.email 
            ? 'Thank you for your message! Check your email for confirmation.'
            : 'Thank you for your message! I will get back to you soon.'
        },
        {
          headers: corsHeaders
        }
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send email',
          details: emailError instanceof Error ? emailError.message : 'Unknown error'
        },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process form submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
} 