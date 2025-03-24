<?php
// Set headers for AJAX response
header('Content-Type: application/json');

// For debugging - log all form submissions
$logFile = 'booking_form_submissions.log';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - New booking form submission\n", FILE_APPEND);

// Database connection parameters
$host = 'localhost';
$dbname = 'uiucitbp_uiucevent_forms';
$username = 'uiucitbp_user';
$password = 'fozsog-mappib-tutPy0';

try {
    // Create database connection
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Log successful database connection
    file_put_contents($logFile, "Database connection successful\n", FILE_APPEND);
    
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $eventType = $_POST['event-type'] ?? '';
    $graduationDate = $_POST['graduation-date'] ?? null;
    $groupSize = $_POST['group-size'] ?? '';
    $sessionDate = $_POST['session-date'] ?? '';
    $sessionTime = $_POST['session-time'] ?? '';
    $location = $_POST['location'] ?? '';
    $customLocation = $_POST['custom-location'] ?? '';
    
    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO booking_submissions 
                          (name, email, phone, event_type, graduation_date, group_size, 
                           session_date, session_time, location, custom_location) 
                          VALUES (:name, :email, :phone, :event_type, :graduation_date, :group_size,
                                  :session_date, :session_time, :location, :custom_location)");
    
    // Bind parameters
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':event_type', $eventType);
    $stmt->bindParam(':graduation_date', $graduationDate);
    $stmt->bindParam(':group_size', $groupSize);
    $stmt->bindParam(':session_date', $sessionDate);
    $stmt->bindParam(':session_time', $sessionTime);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':custom_location', $customLocation);
    
    // Execute statement
    $stmt->execute();
    
    // Log successful database insertion
    file_put_contents($logFile, "Database record inserted successfully\n", FILE_APPEND);

    // Build a complete message with all booking form fields
    $message = "Name: $name\n";
    $message .= "Email: $email\n";
    $message .= "Phone: $phone\n";
    $message .= "Event Type: $eventType\n";

    // Only include these fields if they're relevant
    if (!empty($graduationDate)) {
        $message .= "Graduation Date: $graduationDate\n";
    }
    
    if (!empty($groupSize)) {
        $message .= "Group Size: $groupSize\n";
    }
    
    $message .= "Session Date: $sessionDate\n";
    $message .= "Session Time: $sessionTime\n";
    $message .= "Location: $location\n";
    
    if (!empty($customLocation)) {
        $message .= "Custom Location Details: $customLocation\n";
    }

    // Add submission timestamp
    $message .= "\nSubmitted on: " . date("Y-m-d H:i:s");
    $message .= "\nForm Type: Detailed Booking Form";

    // Log email content
    file_put_contents($logFile, "Email content: \n$message\n", FILE_APPEND);

    // Recipient
    $to = "contact@uiuceventphotos.com";
    $subject = "New Photography Booking Request";

    // Modified headers - use your own domain email as "From"
    $headers = "From: contact@uiuceventphotos.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Attempt to send email and log result
    $mailSent = mail($to, $subject, $message, $headers);
    file_put_contents($logFile, "Mail send attempt result: " . ($mailSent ? "Success" : "Failed") . "\n\n", FILE_APPEND);
    
    // Return success response
    echo json_encode(['success' => true, 'message' => 'Booking submitted successfully']);
    
} catch(PDOException $e) {
    // Log database error
    file_put_contents($logFile, "Database error: " . $e->getMessage() . "\n\n", FILE_APPEND);
    
    // Return error response
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    
    // Log error
    error_log('Booking submission error: ' . $e->getMessage());
}
?>