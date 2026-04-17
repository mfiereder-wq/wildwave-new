import requests
import sys
from datetime import datetime
import json

class WildwaveAPITester:
    def __init__(self, base_url="https://site-refresh-126.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"   Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "",
            200
        )

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+41 78 123 45 67",
            "message": "This is a test message from automated testing."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=test_data
        )
        
        if success and isinstance(response, dict):
            # Verify response contains expected fields
            required_fields = ['id', 'name', 'email', 'message', 'created_at']
            for field in required_fields:
                if field not in response:
                    print(f"❌ Missing field in response: {field}")
                    return False, response
            
            # Verify data matches
            if response['name'] != test_data['name']:
                print(f"❌ Name mismatch: expected {test_data['name']}, got {response['name']}")
                return False, response
                
            if response['email'] != test_data['email']:
                print(f"❌ Email mismatch: expected {test_data['email']}, got {response['email']}")
                return False, response
                
            print("✅ Contact form data validation passed")
            return True, response
        
        return success, response

    def test_contact_form_validation(self):
        """Test contact form validation with missing required fields"""
        # Test missing name
        invalid_data = {
            "email": "test@example.com",
            "message": "Test message"
        }
        
        success, response = self.run_test(
            "Contact Form Validation (Missing Name)",
            "POST",
            "contact",
            422,  # Expecting validation error
            data=invalid_data
        )
        
        return success, response

    def test_get_contact_submissions(self):
        """Test retrieving contact submissions"""
        return self.run_test(
            "Get Contact Submissions",
            "GET",
            "contact",
            200
        )

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test POST status
        status_data = {
            "client_name": "test_client"
        }
        
        success, response = self.run_test(
            "Create Status Check",
            "POST",
            "status",
            200,
            data=status_data
        )
        
        if not success:
            return False
        
        # Test GET status
        success, response = self.run_test(
            "Get Status Checks",
            "GET",
            "status",
            200
        )
        
        return success

def main():
    print("🚀 Starting WILDWAVE API Tests")
    print("=" * 50)
    
    # Setup
    tester = WildwaveAPITester()
    
    # Run tests
    print("\n📡 Testing API connectivity...")
    tester.test_api_root()
    
    print("\n📝 Testing Contact Form functionality...")
    tester.test_contact_form_submission()
    tester.test_contact_form_validation()
    tester.test_get_contact_submissions()
    
    print("\n📊 Testing Status endpoints...")
    tester.test_status_endpoints()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"❌ {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())